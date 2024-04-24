import React, { useEffect } from "react"
import { Auth as AuthInstance, AuthState } from "../../Shares/Auth"
import { Events } from "../../util/EventEmitter";
import { FormControl, FormHelperText, FormLabel, Input, Link, Skeleton, Typography } from "@mui/joy";
import InfoOutlined from "@mui/icons-material/InfoOutlined";

enum AuthFlows {
	LOGIN,
	REGISTER,
	RESET_PASSWORD
}

export function Auth() {

	let [error, setError] = React.useState<string>('');

	let [profile, setProfile] = React.useState<any>(null);

	let [isAuth, setIsAuth] = React.useState<AuthState>(AuthInstance.shared.isAuth);

	let [currentFlow, setCurrentFlow] = React.useState<AuthFlows>(AuthFlows.LOGIN);

	let [username, setUsername] = React.useState<string>('');
	let [password, setPassword] = React.useState<string>('');
	let [passwordConfirm, setPasswordConfirm] = React.useState<string>('');
	let [email, setEmail] = React.useState<string>('');
	let [emailConfirm, setEmailConfirm] = React.useState<string>('');
	let [displayName, setDisplayName] = React.useState<string>('');

	function clear() {
		setUsername('');
		setPassword('');
		setPasswordConfirm('');
		setEmail('');
		setEmailConfirm('');
		setDisplayName('');
		setError('');
	}

	useEffect(() => {
		AuthInstance.shared.subscribe(Events.ON_AUTH_STATE_CHANGE, (newState) => {
			setIsAuth(newState);
		});

		AuthInstance.shared.subscribe(Events.LOGIN_SUCCESSFUL, () => {
			clear();
		});
	
		AuthInstance.shared.subscribeOnce(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});

		AuthInstance.shared.subscribe(Events.LOGIN_FAILED, (error) => {
			setError(error);
		});

		AuthInstance.shared.subscribe(Events.REGISTER_FAILED, (error) => {
			console.log(error);
			setError(error);
		});
	}, []);

	if (isAuth === AuthState.PENDING) {
		return (
			<>
				<Typography level="title-lg">Auth Pending</Typography>
			</>
		)
	}

	if (isAuth === AuthState.AUTH) {
		return (
			<>
				<Typography level="title-lg">Auth</Typography>

				<Typography level="body-md">Logged in as <Skeleton loading={profile === null}>{profile !== null ? profile.display_name : "Unknown"}</Skeleton></Typography>

				<button onClick={() => AuthInstance.shared.logout()}>Logout</button>
			</>
		)
	}

	return (
		<>
		{currentFlow === AuthFlows.LOGIN && (
			<div style={{width: '300px'}}>
				<h1>Login</h1>
				<FormControl error={error === "" ? false : true}>
					<FormLabel>Username</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Password</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<button onClick={() => AuthInstance.shared.login(username, password)}>Login</button>

				<button onClick={() => setCurrentFlow(AuthFlows.REGISTER)}>Register</button>

				<Typography
					endDecorator={<Link href="/register">Sign up</Link>}
					fontSize="sm"
					sx={{ alignSelf: 'center' }}
					>
					Don't have an account?
				</Typography>

				<button onClick={() => setCurrentFlow(AuthFlows.RESET_PASSWORD)}>Reset Password</button>
			</div>
		)}
		{currentFlow === AuthFlows.REGISTER && (
			<div style={{width: '300px'}}>
				<Typography level="title-lg">Register</Typography>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Username</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Username"
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Password</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Confirm Password</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Confirm Password"
						type="password"
						value={passwordConfirm}
						onChange={(e) => setPasswordConfirm(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Email</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Confirm Email</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Confirm Email"
						type="email"
						value={emailConfirm}
						onChange={(e) => setEmailConfirm(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<FormControl error={error === "" ? false : true}>
					<FormLabel>Display Name</FormLabel>
					<Input
						color="neutral"
						variant="soft"
						placeholder="Display Name"
						type="text"
						value={displayName}
						onChange={(e) => setDisplayName(e.target.value)}
					/>
					{error !== "" && (
						<FormHelperText>
							<InfoOutlined />
							{error}
						</FormHelperText>
					)}
				</FormControl>

				<button onClick={() => AuthInstance.shared.register(email, password, emailConfirm, passwordConfirm, username, displayName)}>Register</button>
						
				<button onClick={() => setCurrentFlow(AuthFlows.LOGIN)}>Login</button>
			</div>
		)}
		{currentFlow === AuthFlows.RESET_PASSWORD && (
			<>
				<h1>Reset Password</h1>
				<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
				<button onClick={() => AuthInstance.shared.resetPassword(email)}>Reset Password</button>
				<button onClick={() => setCurrentFlow(AuthFlows.LOGIN)}>Login</button>
			</>
		)}
		</>
	)
}