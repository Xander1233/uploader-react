import { Button, Input, Stack, Table, Typography } from "@mui/joy";
import React from "react";
import { Events } from "../../../util/EventEmitter";
import { Auth } from "../../../Shares/Auth";

export default function Customization() {

	const [profile, setProfile] = React.useState<any>(null);

	const [webTitle, setWebTitle] = React.useState<string>('');
	const [embedTitle, setEmbedTitle] = React.useState<string>('');

	const [webBackgroundColor, setWebBackgroundColor] = React.useState<string>('');
	const [embedColor, setEmbedColor] = React.useState<string>('');

	React.useEffect(() => {
		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
			setWebTitle(profile.config.web_title);
			setEmbedTitle(profile.config.embed_title);
			setWebBackgroundColor(profile.config.background_color);
			setEmbedColor(profile.config.color);
		});

		Auth.shared.subscribe(Events.EMBED_CONFIG_UPDATED, () => {
			Auth.shared.getProfile(true);
		});

		Auth.shared.getProfile();
	}, []);

	async function update() {
		let payload: any = {

		};

		if (webTitle !== profile.config.web_title) {
			payload.web_title = webTitle;
		}

		if (embedTitle !== profile.config.embed_title) {
			payload.title = embedTitle;
		}

		if (webBackgroundColor !== profile.config.background_color) {
			payload.background_color = webBackgroundColor;
		}

		if (embedColor !== profile.config.color) {
			payload.color = embedColor;
		}

		console.log(payload);

		await Auth.shared.updateEmbedConfig(payload);
	}

	return (
		<Stack direction={"column"} spacing={5}>
			<Stack direction={"row"} justifyContent={"space-between"} alignContent={"center"}>
				<Typography level="h1">Customization</Typography>

				<Button variant="solid" sx={{borderRadius: "sm"}} onClick={() => { window.location.href = "/profile/edit" }}>Update profile</Button>
			</Stack>
			
			<Table>
				<tbody>
					<tr>
						<td>Web title</td>
						<td><Input value={webTitle} type="text" onChange={(event) => setWebTitle(event.target.value)} /></td>
					</tr>
					<tr>
						<td>Embed title</td>
						<td><Input value={embedTitle} type="text" onChange={(event) => setEmbedTitle(event.target.value)} /></td>
					</tr>
					<tr>
						<td>Web background color</td>
						<td>
							<Input startDecorator={
								<input type="color" value={webBackgroundColor} onChange={(event) => setWebBackgroundColor(event.target.value)} />
							} type="text" value={webBackgroundColor} onChange={(event) => setWebBackgroundColor(event.target.value)} />
						</td>
					</tr>
					<tr>
						<td>Embed color</td>
						<td>
							<Input startDecorator={
								<input type="color" value={embedColor} onChange={(event) => setEmbedColor(event.target.value)} />
							} type="text" value={embedColor} onChange={(event) => setEmbedColor(event.target.value)} />
						</td>
					</tr>
				</tbody>
			</Table>

			<Button sx={{width: "100px"}} size="lg" variant="solid" onClick={() => update() }>Save</Button>
		</Stack>
	);
}