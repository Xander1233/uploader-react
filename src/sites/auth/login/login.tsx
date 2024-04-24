import { Box, Button, FormControl, FormLabel, Input, Link, Stack, Typography } from "@mui/joy";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { Auth, CurrentFlow } from "../../../Shares/Auth";

export default function LoginForm({ redirect }: { redirect: string }) {

	let [username, setUsername] = React.useState<string>('');
	let [password, setPassword] = React.useState<string>('');

	let [error, setError] = React.useState<string>('');

	let [isLoading, setIsLoading] = React.useState<boolean>(false);

	const navigate = useNavigate();

	const profile = Auth.shared.profile;

	async function login() {
		setIsLoading(true);
		const success = await Auth.shared.login(username, password);
		setIsLoading(false);

		if (success) {
			navigate(`${redirect}`);
			return;
		}
	}

	return (
		<form onSubmit={(e) => {
			e.preventDefault();
			login();
		}}>
			{profile && (
				<Navigate to="/" replace />
			)}

			<Stack direction={"column"} spacing={2}>
				<Typography level="h4">Sign in</Typography>

				<FormControl>
					<FormLabel>Username</FormLabel>
					<Input type="text" required onChange={(e) => setUsername(e.target.value)} />
				</FormControl>

				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input type="password" required onChange={(e) => setPassword(e.target.value)} />
				</FormControl>

				<Button type="submit" disabled={isLoading}>Sign in</Button>

				<Box>
					<Typography>Don't have an account? <Link onClick={() => { Auth.shared.setFlow(CurrentFlow.REGISTER) }}>Create one here</Link></Typography>
				</Box>

				<Box>
					<Typography>Forgot your password? <Link onClick={() => { Auth.shared.setFlow(CurrentFlow.RESET_PASSWORD) }}>Reset it here</Link></Typography>
				</Box>
			</Stack>
		</form>
	);
}