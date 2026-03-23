import { API_ENDPOINTS, USER_ROLES } from "../../../core/constants";
import { ApiError, apiClient } from "../../../core/services/httpClient";
import type { UserRole } from "../../../core/constants/roles";
import type { AuthUserPayload } from "../../../core/types/auth";

interface LoginResponseDto {
	id: string | number;
	name: string;
	role: string;
	success?: boolean;
	message?: string;
}

interface SignInResult {
	token: string;
	user: AuthUserPayload;
}

interface EmployeeResponseDto {
	id: string;
	firstname: string;
	lastname: string;
	email: string;
	role: string;
	profilePicture?: string | null;
}

function isUserRole(role: string): role is UserRole {
	return role === USER_ROLES.ADMIN || role === USER_ROLES.DOCTOR;
}

function createSessionToken(userId: string): string {
	return `mockoon-session-${userId}`;
}

function toTrimmedString(value: unknown): string {
	if (typeof value !== "string") return "";
	return value.trim();
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null;
}

function toNonEmptyString(value: unknown): string {
	if (typeof value === "string") return value.trim();
	if (typeof value === "number") return String(value);
	return "";
}

function pickFirstNonEmpty(...values: unknown[]): string {
	for (const value of values) {
		const normalized = toNonEmptyString(value);
		if (normalized) return normalized;
	}
	return "";
}

function normalizeRole(rawRole: unknown): UserRole {
	const role = toTrimmedString(rawRole).toLowerCase();

	if (!role) {
		// This login path targets staff users; default to doctor when backend omits role.
		// THIS IS FOR INTEGRATION TEST ONLY, MUST DELETE LATER
		return USER_ROLES.DOCTOR;
	}

	if (role === USER_ROLES.ADMIN || role === USER_ROLES.DOCTOR) {
		return role;
	}

	// Backend contracts may return staff-like labels for doctor-level users.
	// THIS IS FOR INTEGRATION TEST ONLY, MUST DELETE LATER

	if (
		role === "staff" ||
		role.includes("doctor") ||
		role.includes("staff") ||
		role.includes("medic")
	) {
		return USER_ROLES.DOCTOR;
	}

	if (role.includes("admin")) {
		return USER_ROLES.ADMIN;
	}

	// Keep login resilient for backend role naming differences.
	// THIS IS FOR INTEGRATION TEST ONLY, MUST DELETE LATER
	return USER_ROLES.DOCTOR;
}

function mapLoginResponse(email: string, response: LoginResponseDto): SignInResult {
	const payload = isRecord(response)
		? (isRecord(response.data) ? response.data : response)
		: {};

	const successFlag = payload.success;
	if (successFlag === false) {
		const backendMessage = toNonEmptyString(payload.message);
		throw new Error(backendMessage || "Invalid email or password");
	}

	const userPayload = isRecord(payload.user) ? payload.user : payload;
	const normalizedRole = normalizeRole(
		pickFirstNonEmpty(
			userPayload.role,
			userPayload.user_role,
			userPayload.userRole
		)
	);
	const userId = pickFirstNonEmpty(
		userPayload.id,
		userPayload.user_id,
		userPayload.userId,
		payload.id,
		payload.user_id,
		payload.userId
	);
	const normalizedName = pickFirstNonEmpty(
		userPayload.name,
		userPayload.full_name,
		userPayload.fullName,
		`${pickFirstNonEmpty(userPayload.first_name, userPayload.firstname)} ${pickFirstNonEmpty(userPayload.last_name, userPayload.lastname)}`,
		payload.name,
		payload.full_name,
		payload.fullName,
		toTrimmedString(email).split("@")[0]
	);
	const normalizedEmail = toTrimmedString(email).toLowerCase();

	if (!userId || !normalizedEmail) {
		throw new Error("Login response is missing required user fields.");
	}

	return {
		token: createSessionToken(userId),
		user: {
			id: userId,
			email: normalizedEmail,
			name: normalizedName,
			role: normalizedRole,
			profilePicture: null,
		},
	};
}

function mapEmployeeResponse(response: EmployeeResponseDto): AuthUserPayload {
	const normalizedRole = normalizeRole(response.role);
	const fullName = `${response.firstname ?? ""} ${response.lastname ?? ""}`.trim();
	const normalizedEmail = toTrimmedString(response.email).toLowerCase();

	if (!response.id || !normalizedEmail || !fullName || !isUserRole(normalizedRole)) {
		throw new Error("Current user response is missing required user fields.");
	}

	return {
		id: response.id,
		email: normalizedEmail,
		name: fullName,
		role: normalizedRole,
		profilePicture: response.profilePicture ?? null,
	};
}

function isAuthError(error: unknown): boolean {
	if (!(error instanceof ApiError)) return false;
	return error.status === 401 || error.status === 404;
}

function mapSignInError(error: unknown): Error {
	if (error instanceof ApiError) {
		const maybeDetail =
			typeof error.data === "object" &&
			error.data !== null &&
			"detail" in error.data &&
			typeof error.data.detail === "string"
				? error.data.detail
				: null;

		if (maybeDetail && maybeDetail.trim().length > 0) {
			if (maybeDetail.toLowerCase().includes("invalid password")) {
				return new Error("Invalid email or password");
			}
			return new Error(maybeDetail);
		}

		if (error.status === 400) {
			return new Error("Email and password are required");
		}

		if (error.status === 401) {
			return new Error("Invalid email or password");
		}

		if (
			error.status === 500 &&
			typeof error.data === "object" &&
			error.data !== null &&
			"reason" in error.data &&
			error.data.reason === "NETWORK_ERROR"
		) {
			return new Error("Internal server error (500)");
		}

		if (error.message && error.message.trim().length > 0) {
			return new Error(`${error.message} (${error.status})`);
		}

		return new Error(`Request failed (${error.status})`);
	}

	if (error instanceof Error) {
		return error;
	}

	return new Error("Sign in failed. Please try again.");
}

export const authApi = {
	async signIn(email: string, password: string): Promise<SignInResult> {
		try {
			const normalizedEmail = toTrimmedString(email);
			if (!normalizedEmail) {
				throw new Error("Email is required");
			}

			const response = await apiClient.post<LoginResponseDto>(
				API_ENDPOINTS.AUTH.LOGIN,
				undefined,
				{
					query: {
						email: normalizedEmail,
						password,
					},
					skipAuth: true,
				}
			);

			return mapLoginResponse(normalizedEmail, response);
		} catch (error) {
			throw mapSignInError(error);
		}
	},

	async getCurrentUserById(id: string): Promise<AuthUserPayload> {
		const response = await apiClient.get<EmployeeResponseDto>(API_ENDPOINTS.EMPLOYEES.DETAIL(id));
		return mapEmployeeResponse(response);
	},

	isCurrentUserAuthError(error: unknown): boolean {
		return isAuthError(error);
	},
};
