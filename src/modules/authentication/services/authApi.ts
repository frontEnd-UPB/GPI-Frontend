import { API_ENDPOINTS, USER_ROLES } from "../../../core/constants";
import { ApiError, apiClient } from "../../../core/services/httpClient";
import type { UserRole } from "../../../core/constants/roles";
import type { AuthUserPayload } from "../../../core/types/auth";

interface LoginResponseDto {
	id: string;
	name: string;
	role: string;
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

function mapLoginResponse(email: string, response: LoginResponseDto): SignInResult {
	const normalizedRole = response.role.trim().toLowerCase();

	if (!response.id || !response.name || !isUserRole(normalizedRole)) {
		throw new Error("Login response is missing required user fields.");
	}

	return {
		token: createSessionToken(response.id),
		user: {
			id: response.id,
			email: email.trim().toLowerCase(),
			name: response.name.trim(),
			role: normalizedRole,
			profilePicture: null,
		},
	};
}

function mapEmployeeResponse(response: EmployeeResponseDto): AuthUserPayload {
	const normalizedRole = response.role.trim().toLowerCase();
	const fullName = `${response.firstname ?? ""} ${response.lastname ?? ""}`.trim();

	if (!response.id || !response.email || !fullName || !isUserRole(normalizedRole)) {
		throw new Error("Current user response is missing required user fields.");
	}

	return {
		id: response.id,
		email: response.email.trim().toLowerCase(),
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
			const response = await apiClient.post<LoginResponseDto>(
				API_ENDPOINTS.AUTH.LOGIN,
				{
					email: email.trim(),
					password,
				},
				{ skipAuth: true }
			);

			return mapLoginResponse(email, response);
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
