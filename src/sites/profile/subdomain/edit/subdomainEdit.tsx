import { Box, Button, FormControl, FormLabel, Input, Skeleton, Stack, Typography } from "@mui/joy";
import React from "react";
import { Auth } from "../../../../Shares/Auth";
import { Events } from "../../../../util/EventEmitter";

const check_subdomain = (subdomain: string) => {
	const regex = /^[a-z0-9]+$/;
	return regex.test(subdomain);
}

export default function SubdomainEdit() {

	const [subdomain, setSubdomain] = React.useState<string>('');

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		(async () => {
			Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
				setProfile(profile);
			});
	
			Auth.shared.subscribe(Events.CUSTOM_DOMAIN_SET_SUCCESSFUL, () => {
				window.location.href = "/profile/subdomain";
			});
	
			setProfile(await Auth.shared.getProfile());
			setSubdomain(profile?.subdomain ?? "");
		})();
	}, []);

	async function saveSubdomain() {
		console.log(profile, subdomain);

		if (profile !== null && profile.subdomain === subdomain) {
			return;
		}

		if (!check_subdomain(subdomain)) {
			return;
		}

		await Auth.shared.setSubdomain(subdomain);
	}

	return (
		<Stack>
			<Typography level="h1">Set a subdomain</Typography>

			<Box sx={{mt: "50px"}}>
				<form onSubmit={(e) => {
					e.preventDefault();
					saveSubdomain();
				}}>
					<Stack spacing={5}>
						<FormControl sx={{width: "200px"}}>
							<FormLabel>Subdomain</FormLabel>
							<Input type="text" required onChange={(e) => {
								setSubdomain(e.target.value);
								console.log(e.target.value);
							} } />
						</FormControl>

						<Box sx={{width: "450px"}}>
							<Typography level="body-sm">
								The subdomain will be available right after you save it and will be accessible at <b>{subdomain}.sparkcloud.link</b>
							</Typography>
						</Box>

						<Button sx={{width: "200px"}} type="submit">Save</Button>
					</Stack>
				</form>
			</Box>
		</Stack>
	);
}