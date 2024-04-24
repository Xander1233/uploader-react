import React from "react";
import { Auth } from "../../../Shares/Auth";
import { Events } from "../../../util/EventEmitter";
import { Box, Button, Link, Stack, Table, Typography } from "@mui/joy";
import { convertTimestamp } from "../../../util/timestampConverter";
import { formatBytes } from "../../../util/formatBytes";

export default function ProfileOverview() {

	const [profile, setProfile] = React.useState<any>(null);

	React.useEffect(() => {
		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});
	}, []);
	
	return (
		<Stack direction={"column"} spacing={5}>
			<Box>
				<Stack direction={"row"} justifyContent={"space-between"} alignContent={"center"}>
					<Typography level="h1">Profile Overview</Typography>

					<Button variant="solid" sx={{borderRadius: "sm"}} onClick={() => { window.location.href = "/profile/edit" }}>Update profile</Button>
				</Stack>

				<Table>
					<tbody>
						<tr>
							<td>Username</td>
							<td>{profile?.username}</td>
						</tr>
						<tr>
							<td>Display Name</td>
							<td>{profile?.display_name}</td>
						</tr>
						<tr>
							<td>Email</td>
							<td>{profile?.email}</td>
						</tr>
						<tr>
							<td>Created at</td>
							<td>{profile !== null ? convertTimestamp(profile.created_at) : ""}</td>
						</tr>
						<tr>
							<td>Current subscription</td>
							<td>{profile?.current_tier}</td>
						</tr>
						<tr>
							<td>Custom Domain (Verified)</td>
							<td>{profile?.custom_domain ? 
								(<Link href={`https://${profile.custom_domain}`} target="_blank">{profile.custom_domain}</Link>) :
								("N/A")
							} ({profile?.custom_domain_verified ? "Yes" : "No"})</td>
						</tr>
					</tbody>
				</Table>
			</Box>

			<Box>
				<Typography level="h2">Statistics</Typography>

				<Table>
					<tbody>
						<tr>
							<td>Total views</td>
							<td>{profile?.stats.total_views}</td>
						</tr>
						<tr>
							<td>Total uploads</td>
							<td>{profile?.stats.total_uploads}</td>
						</tr>
						<tr>
							<td>Total private uploads</td>
							<td>{profile?.stats.total_private_uploads}</td>
						</tr>
						<tr>
							<td>Total password protected uploads</td>
							<td>{profile?.stats.total_password_protected_uploads}</td>
						</tr>
						<tr>
							<td>Storage used</td>
							<td>{formatBytes(profile?.stats.storage_used)}</td>
						</tr>
					</tbody>
				</Table>
			</Box>
		</Stack>
	);
}