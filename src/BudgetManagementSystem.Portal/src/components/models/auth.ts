export interface UserResponse {
    id: number;
    name: string;
    surname: string;
    username: string;
    email:string;
  }

export interface UserRegisterRequest {
    name: string;
    surname: string;
    username: string;
    email:string;
    password:string;
  }

export interface UserLoginResponse {
    id:number;
    username: string;
    role:string;
    token:string;
    refreshtoken:string;
  }
  
export interface UserLoginRequest {
    email: string;
    password:string;
  }

  export interface RefreshTokenRequest {
    refreshtoken: string;
  }