import { Box, Button, Link, Skeleton, Stack, Table, Typography } from "@mui/joy";
import { Events } from "../../../util/EventEmitter";
import React from "react";
import { Auth } from "../../../Shares/Auth";

export default function CustomDomainTab() {

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});

		Auth.shared.subscribe(Events.CUSTOM_DOMAIN_VERIFIED, async (status) => {
			await Auth.shared.getProfile(true);
		});

		Auth.shared.subscribe(Events.CUSTOM_DOMAIN_DELETED, async (status) => {
			await Auth.shared.getProfile(true);
		});

		Auth.shared.getProfile(true);
	}, []);

	async function verifyCustomDomain() {
		await Auth.shared.verifyCustomDomain();
	}

	async function deleteCustomDomain() {
		await Auth.shared.deleteCustomDomain();
	}

	function isBusiness() {
		let cur_tier = profile?.current_tier ?? "";
		return cur_tier.includes("Business");
	}

	return (
		<Stack spacing={3}>

			<Stack direction={"row"} justifyContent={"space-between"}>
				<Typography level="h1">Custom Domain</Typography>

				<Stack direction={"row"} spacing={5}>
					{profile?.custom_domain !== '' && (
						<Button color="danger" size="sm" variant="soft" onClick={() => deleteCustomDomain()}>Delete Custom Domain</Button>
					)}

					<Button disabled={!isBusiness()} variant="solid" onClick={() => window.location.href = "/profile/custom-domain/edit"}>Edit Custom Domain</Button>
				</Stack>
			</Stack>

			<Typography level="body-xs">
				Here you can set a custom domain for your profile. A custom domain allows you to use your own domain name instead of the default one provided by SparkCloud. 
				<br />
				To set a custom domain, you must first verify it. You have to set up a <b>CNAME</b> record that points to the domain <b><Skeleton loading={profile === null} variant="inline">{profile?.id.toLowerCase()}</Skeleton>-user.sparkcloud.link</b>
				<br />
				Accessing different parts of the website or API using the custom domain is not supported, only the uploaded files are accessible through the custom domain.
				<br /><br />
				<Typography level="body-md">Custom domains are only available for Business Plan users.{!isBusiness() && (<> <Link href="/subscribe">Upgrade here</Link>.</>)}</Typography>
			</Typography>

			<Table>
				<tbody>
					<tr>
						<td>Custom Domain (Verified)</td>
						<td>
							{profile?.custom_domain ? 
								(<Link href={`https://${profile.custom_domain}`} target="_blank">{profile.custom_domain}</Link>) :
								("N/A")
							} ({profile?.custom_domain_verified ? "Yes" : "No"})
							{!profile?.custom_domain_verified && (
								<Button sx={{ml: "15px"}} size="sm" variant="plain" onClick={() => verifyCustomDomain()}>Verify</Button>
							)}
						</td>
					</tr>
				</tbody>
			</Table>
		</Stack>
	);
}