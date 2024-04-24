import { Box, Button, Link, Skeleton, Stack, Table, Typography } from "@mui/joy";
import { Events } from "../../../util/EventEmitter";
import React from "react";
import { Auth } from "../../../Shares/Auth";

export default function SubdomainTab() {

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});

		Auth.shared.subscribe(Events.SUBDOMAIN_DELETED, async (status) => {
			await Auth.shared.getProfile(true);
		});

		Auth.shared.getProfile(true);
	}, []);

	async function deleteSubdomain() {
		await Auth.shared.deleteSubdomain();
	}

	function isAllowed() {
		let cur_tier = profile?.current_tier ?? "";
		return cur_tier.includes("Business") || cur_tier.includes("Plus");
	}

	return (
		<Stack spacing={3}>

			<Stack direction={"row"} justifyContent={"space-between"}>
				<Typography level="h1">Subdomain</Typography>

				<Stack direction={"row"} spacing={5}>
					{profile?.custom_domain !== '' && (
						<Button color="danger" size="sm" variant="soft" onClick={() => deleteSubdomain()}>Delete Subdomain</Button>
					)}

					<Button disabled={!isAllowed()} variant="solid" onClick={() => window.location.href = "/profile/subdomain/edit"}>Edit Subdomain</Button>
				</Stack>
			</Stack>

			<Typography level="body-xs">
				Here you can set a subdomain for your profile. A subdomain allows you to use your own subdomain (e.g. <b>yourname.sparkcloud.link</b>).
				<br />
				Accessing different parts of the website or API using the subdomain is not supported, only the uploaded files and uploading are accessible through the subdomain.
				<br /><br />
				<Typography level="body-md">Subdomains are only available for Plus or Business Plan users.{!isAllowed() && (<> <Link href="/subscribe">Upgrade here</Link>.</>)}</Typography>
			</Typography>

			<Table>
				<tbody>
					<tr>
						<td>Subdomain</td>
						<td>
							{profile?.subdomain ? 
								(<Link href={`https://${profile.subdomain}.sparkcloud.link`} target="_blank">{profile.subdomain}.sparkcloud.link</Link>) :
								("N/A")
							}
						</td>
					</tr>
				</tbody>
			</Table>
		</Stack>
	);
}