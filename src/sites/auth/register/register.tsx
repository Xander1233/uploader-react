import { Box, Button, FormControl, FormHelperText, FormLabel, Input, Link, Stack, Step, StepIndicator, Stepper, Typography } from "@mui/joy";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { Auth, CurrentFlow } from "../../../Shares/Auth";
import { CheckRounded } from "@mui/icons-material";

export default function RegisterForm({ redirect }: { redirect: string }) {

	let [username, setUsername] = React.useState<string>('');

	let [email, setEmail] = React.useState<string>('');
	let [emailConfirm, setEmailConfirm] = React.useState<string>('');

	let [password, setPassword] = React.useState<string>('');
	let [passwordConfirm, setPasswordConfirm] = React.useState<string>('');

	let [displayName, setDisplayName] = React.useState<string>('');

	let [error, setError] = React.useState<string>('');

	let [isLoading, setIsLoading] = React.useState<boolean>(false);

	const navigate = useNavigate();

	const profile = Auth.shared.profile;

	const [isEmailAndPasswordSection, setIsEmailAndPasswordSection] = React.useState<boolean>(false);

	async function register() {
		setIsLoading(true);
		const success = await Auth.shared.register(email, password, emailConfirm, passwordConfirm, username, displayName);
		setIsLoading(false);

		if (success) {
			navigate(`${redirect}`);
			return;
		}
	}

	return (
		<>
			{!isEmailAndPasswordSection && (
				<form onSubmit={(e) => {
					e.preventDefault();
					setIsEmailAndPasswordSection(true);
				}}>
					<Stack direction={"column"} spacing={2}>
						<Typography level="h4">Sign up</Typography>
						<Stepper>
							<Step indicator={(
								<StepIndicator variant="soft" color="primary">1</StepIndicator>
							)}>
								<Typography level="body-sm">Account Details</Typography>
							</Step>
							<Step indicator={(
								<StepIndicator variant="soft">2</StepIndicator>
							)}>
								<Typography level="body-sm">Email & Password</Typography>
							</Step>
						</Stepper>

						<FormControl>
							<FormLabel>Username</FormLabel>
							<Input type="text" required onChange={(e) => setUsername(e.target.value)} />
							<FormHelperText>Your username is unique and cannot be changed.</FormHelperText>
						</FormControl>
		
						<FormControl>
							<FormLabel>Display Name</FormLabel>
							<Input type="text" required onChange={(e) => setDisplayName(e.target.value)} />
							<FormHelperText>Your display name is what other users will see. You can change it later.</FormHelperText>
						</FormControl>
		
						<Button type="submit">Continue</Button>
		
						<Box>
							<Typography>Already have an account? <Link onClick={() => { Auth.shared.setFlow(CurrentFlow.LOGIN) }}>Sign in here</Link></Typography>
						</Box>
					</Stack>
				</form>
			)}

			{isEmailAndPasswordSection && (
				<form onSubmit={(e) => {
					e.preventDefault();
					register();
				}}>
					<Stack direction={"column"} spacing={2}>
						<Typography level="h4">Sign up</Typography>
						<Stepper>
							<Step indicator={(
								<StepIndicator variant="solid" color="primary"><CheckRounded /></StepIndicator>
							)}>
								<Link onClick={() => setIsEmailAndPasswordSection(false)}><Typography level="body-sm">Account Details</Typography></Link>
							</Step>
							<Step indicator={(
								<StepIndicator variant="soft" color="primary">2</StepIndicator>
							)}>
								<Typography level="body-sm">Email & Password</Typography>
							</Step>
						</Stepper>
						
						<FormControl>
							<FormLabel>Mail</FormLabel>
							<Input type="email" required onChange={(e) => setEmail(e.target.value)} />
						</FormControl>

						<FormControl>
							<FormLabel>Confirm Mail</FormLabel>
							<Input type="email" required onChange={(e) => setEmailConfirm(e.target.value)} />
						</FormControl>
		
						<FormControl>
							<FormLabel>Password</FormLabel>
							<Input type="password" required onChange={(e) => setPassword(e.target.value)} />
						</FormControl>

						<FormControl>
							<FormLabel>Confirm Password</FormLabel>
							<Input type="password" required onChange={(e) => setPasswordConfirm(e.target.value)} />
						</FormControl>

						<Box>
							<Typography level="body-sm">
								By clicking "Complete sign up", you agree to our <Link href="/terms" target="_blank">Terms of Service</Link> and <Link href="/privacy" target="_blank">Privacy Policy</Link>.
							</Typography>
						</Box>
		
						<Button type="submit" disabled={isLoading}>Complete sign up</Button>
		
						<Box>
							<Typography>Already have an account? <Link onClick={() => { Auth.shared.setFlow(CurrentFlow.LOGIN) }}>Sign in here</Link></Typography>
						</Box>
					</Stack>
				</form>
			)}
		</>
	);
}