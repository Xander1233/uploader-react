import { Box, Button, FormControl, FormLabel, Input, Skeleton, Stack, Typography } from "@mui/joy";
import React from "react";
import { Auth } from "../../../../Shares/Auth";
import { Events } from "../../../../util/EventEmitter";
import { useNavigate } from "react-router";

export default function CustomDomainEdit() {

	const [customDomain, setCustomDomain] = React.useState<string>('');

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		(async () => {
			Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
				setProfile(profile);
				setCustomDomain(profile?.custom_domain ?? "");
			});
	
			Auth.shared.subscribe(Events.CUSTOM_DOMAIN_SET_SUCCESSFUL, () => {
				window.location.href = "/profile/custom-domain";
			});
	
			setProfile(await Auth.shared.getProfile());
			setCustomDomain(profile?.custom_domain ?? "");
		})();
	}, []);

	async function saveCustomDomain() {
		console.log(profile, customDomain);

		if (profile !== null && profile.custom_domain === customDomain) {
			return;
		}

		await Auth.shared.setCustomDomain(customDomain);
	}

	return (
		<Stack>
			<Typography level="h1">Set a new custom domain</Typography>

			<Box sx={{mt: "50px"}}>
				<form onSubmit={(e) => {
					e.preventDefault();
					saveCustomDomain();
				}}>
					<Stack spacing={5}>
						<FormControl sx={{width: "200px"}}>
							<FormLabel>Custom Domain</FormLabel>
							<Input type="text" required onChange={(e) => {
								setCustomDomain(e.target.value)
								console.log(e.target.value);
							} } />
						</FormControl>

						<Box sx={{width: "450px"}}>
							<Typography level="body-sm">
								The custom domain must be verified and set upped before it can be used. You have to set up a <b>CNAME</b> record that points to the domain <b><Skeleton loading={profile === null} variant="inline">{profile?.id.toLowerCase()}</Skeleton>-user.sparkcloud.link</b>
								<br /><br />
								Please note that it may take up to 24 hours for the DNS records to propagate.
								<br /><br />
								You will not be able to use the domain until it is verified. To verify the domain, click the verify button in the custom domain tab.
							</Typography>
						</Box>

						<Button sx={{width: "200px"}} type="submit">Save</Button>
					</Stack>
				</form>
			</Box>
		</Stack>
	);
}