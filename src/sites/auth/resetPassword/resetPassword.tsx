import { Box, Button, FormControl, FormLabel, Input, Link, Stack, Typography } from "@mui/joy";
import React from "react";
import { Navigate, useNavigate } from "react-router";
import { Auth, CurrentFlow } from "../../../Shares/Auth";

export default function ResetPasswordForm() {

	let [email, setEmail] = React.useState<string>('');

	let [sendLink, setSendLink] = React.useState<boolean>(false);

	let [isLoading, setIsLoading] = React.useState<boolean>(false);

	async function getLink() {
		setIsLoading(true);
		const isSuccess = await Auth.shared.resetPassword(email);
		setSendLink(isSuccess);
		setIsLoading(false);
	}

	return (
		<>
			{!sendLink && (
				<form onSubmit={(e) => {
					e.preventDefault();
					getLink();
				}}>
					<Stack direction={"column"} spacing={2}>
						<Typography level="h4">Reset password</Typography>
		
						<FormControl>
							<FormLabel>Email</FormLabel>
							<Input type="email" required onChange={(e) => setEmail(e.target.value)} />
						</FormControl>
		
						<Button type="submit" disabled={isLoading}>Send reset link</Button>
		
						<Box>
							<Typography><Link onClick={() => { Auth.shared.setFlow(CurrentFlow.REGISTER) }}>Create account</Link></Typography>
						</Box>
		
						<Box>
							<Typography><Link onClick={() => { Auth.shared.setFlow(CurrentFlow.LOGIN) }}>Sign in</Link></Typography>
						</Box>
					</Stack>
				</form>
			)}

			{sendLink && (
				<Box>
					<Stack direction={"column"} spacing={2}>
						<Typography level="h4">Reset password</Typography>

						<Typography level="body-sm">
							A password reset link has been sent to your email. Please check your inbox. Don't forget to check your spam folder.
						</Typography>

						<Button type="submit" onClick={() => {
							Auth.shared.setFlow(CurrentFlow.LOGIN);
						}}>Return to login</Button>

						<Box>
							<Typography><Link onClick={() => { Auth.shared.setFlow(CurrentFlow.REGISTER) }}>Create account</Link></Typography>
						</Box>
					</Stack>
				</Box>
			)}
		</>
	);
}