import { Box, Button, DialogContent, DialogTitle, Dropdown, ListItemContent, ListItemDecorator, Menu, MenuButton, MenuItem, Modal, ModalClose, ModalDialog, Stack, Table, Typography } from "@mui/joy";
import React from "react";
import { Auth } from "../../../../Shares/Auth";
import { Events } from "../../../../util/EventEmitter";
import { DeleteForeverRounded, MoreHorizRounded, RefreshRounded } from "@mui/icons-material";
import { convertTimestamp } from "../../../../util/timestampConverter";
import { createShareXFile } from "../../../../util/createShareXFile";
import { uploadTokenUses } from "../../../../util/uploadTokenUses";

export default function DetailedToken({ tokenId }: { tokenId: string}) {

	const [data, setData] = React.useState<any>(null);

	const [createdToken, setCreatedToken] = React.useState<string>('');

	async function regenerateToken(tokenId: string) {
		const res = await Auth.shared.regenerateUploadToken(tokenId);

		if (res) {
			Auth.shared.fetchUploadTokens();
			setCreatedToken(res.token);
		} else {
			alert('Failed to regenerate token');
		}
	}

	async function deleteToken(tokenId: string) {
		const res = await Auth.shared.deleteUploadToken(tokenId);
		Auth.shared.fetchUploadTokens();
		alert('Deleted token ' + tokenId);
	}

	React.useEffect(() => {
		Auth.shared.subscribe(Events.UPLOAD_TOKEN_FETCHED, (data) => {
			setData(data);
		});

		Auth.shared.fetchUploadToken(tokenId);
	}, []);
	
	return (
		<Stack direction={"column"} spacing={7}>

			<Modal open={createdToken !== ""} onClose={() => setCreatedToken("")}>
				<ModalDialog>
					<ModalClose />
					<DialogTitle>Secret Token</DialogTitle>
					<DialogContent>
						<Stack spacing={2}>
							<Typography>
								Please save the token below. You will not be able to see it again. In case you lose it, you can regenerate it.
							</Typography>
							<Typography>
								{createdToken} <Button sx={{ml: "10px"}} color="primary" onClick={() => {
									navigator.clipboard.writeText(createdToken);
								}}>
									Copy
								</Button>
							</Typography>
						</Stack>
					</DialogContent>
				</ModalDialog>
			</Modal>

			<Stack direction={"column"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={3}>
				<Stack direction={"row"} justifyContent={"space-between"} sx={{width: "100%"}}>
					<Typography level="h1">Token {tokenId}</Typography>

					<Dropdown>
						<MenuButton variant="soft" >
							<MoreHorizRounded />
						</MenuButton>
						<Menu>
							<MenuItem color="primary" onClick={() => regenerateToken(data.token_id)}>
								<ListItemDecorator><RefreshRounded /></ListItemDecorator>
								<ListItemContent>Regenerate</ListItemContent>
							</MenuItem>

							<MenuItem color="danger" onClick={() => deleteToken(data.token_id)}>
								<ListItemDecorator><DeleteForeverRounded /></ListItemDecorator>
								<ListItemContent>Delete</ListItemContent>
							</MenuItem>
						</Menu>
					</Dropdown>
				</Stack>
				
				<Table>
					<tbody>
						<tr>
							<td>Id</td>
							<td>{data?.token_id}</td>
						</tr>
						<tr>
							<td>Name</td>
							<td>{data?.name}</td>
						</tr>
						<tr>
							<td>Description</td>
							<td>{data?.description}</td>
						</tr>
						<tr>
							<td>Created at</td>
							<td>
								{
									data !== null ? new Date(data.created_at).toLocaleDateString() : ""
								} {
									data !== null ? new Date(data.created_at).toLocaleTimeString() : ""
								}
							</td>
						</tr>
						<tr>
							<td>Total Uses/Max Uses</td>
							<td>{data?.uses}/{uploadTokenUses(data?.max_uses ?? 0)}</td>
						</tr>
						<tr>
							<td>Active uploads from this token</td>
							<td>{data?.uses_arr.length}</td>
						</tr>
					</tbody>
				</Table>
			</Stack>

			<Stack direction={"column"} justifyContent={"flex-start"} alignItems={"flex-start"} spacing={3}>
				<Typography level="h3">Uses</Typography>

				<Table>
					<thead>
						<tr>
							<th>Id</th>
							<th>File Id</th>
							<th>Upload Date</th>
						</tr>
					</thead>
					<tbody>
						{data?.uses_arr.map((use: any, index: number) => {
							return (
								<tr key={use.id}>
									<td>{use.id}</td>
									<td>{use.file_id}</td>
									<td>{convertTimestamp(use.created_at)}</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Stack>
		</Stack>
	)
}