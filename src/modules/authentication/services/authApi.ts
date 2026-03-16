import { API_ENDPOINTS, USER_ROLES } from "../../../core/constants";
import type { UserRole } from "../../../core/constants/roles";
import { httpRequest } from "../../../core/services/httpClient";
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

export const authApi = {
	async signIn(email: string, password: string): Promise<SignInResult> {
		const response = await httpRequest<LoginResponseDto>(API_ENDPOINTS.AUTH.LOGIN, {
			method: "POST",
			skipAuth: true,
			body: {
				email: email.trim(),
				password,
			},
		});

		return mapLoginResponse(email, response);
	},
};
