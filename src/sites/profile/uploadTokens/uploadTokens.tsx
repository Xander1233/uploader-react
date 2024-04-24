import { Box, Button, DialogContent, DialogTitle, Dropdown, FormControl, FormLabel, Input, Link, ListItemButton, ListItemContent, ListItemDecorator, Menu, MenuButton, MenuItem, Modal, ModalClose, ModalDialog, Sheet, Stack, Table, Typography } from "@mui/joy";
import React from "react";
import { Auth } from "../../../Shares/Auth";
import { Events } from "../../../util/EventEmitter";
import { AddRounded, DeleteForeverRounded, MoreHoriz, MoreHorizRounded, RefreshRounded } from "@mui/icons-material";
import { convertTimestamp } from "../../../util/timestampConverter";
import { createShareXFile } from "../../../util/createShareXFile";
import { uploadTokenUses } from "../../../util/uploadTokenUses";

export default function UploadTokens() {

	const [tokens, setTokens] = React.useState<any[]>([]);

	const [createTokenModal, setCreateTokenModal] = React.useState<boolean>(false);

	const [createdToken, setCreatedToken] = React.useState<string>('');
	const [shareXFile, setShareXFile] = React.useState<string>('');

	const [tokenName, setTokenName] = React.useState<string>('');
	const [tokenDescription, setTokenDescription] = React.useState<string>('');
	const [tokenMaxUses, setTokenMaxUses] = React.useState<number>(1);

	async function createToken() {
		
		const res = await Auth.shared.createUploadToken(tokenName, tokenDescription, tokenMaxUses);

		if (res) {
			setTokenName('');
			setTokenDescription('');
			setTokenMaxUses(1);
			setCreateTokenModal(false);
			Auth.shared.fetchUploadTokens();
			setShareXFile(createShareXFile(res.token));
			setCreatedToken(res.token);
		} else {
			setCreateTokenModal(false);
			alert('Failed to create token');
		}
	}

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
		Auth.shared.subscribe(Events.UPLOAD_TOKENS_FETCHED, (tokens) => {
			setTokens(tokens);
		});

		Auth.shared.fetchUploadTokens();
	}, []);

	function createTokenTable() {
		return tokens.map((token) => {
			return (
				<tr key={token.token_id}>
					<td>
						<Link href={`/profile/tokens/${token.token_id}`}>
							{token.token_id}
						</Link>
					</td>
					<td style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{token.name}</td>
					<td style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{token.description}</td>
					<td>
						{convertTimestamp(token.created_at)}
					</td>
					<td>{token.uses}/{uploadTokenUses(token.max_uses)}</td>
					<td>
						<Dropdown>
							<MenuButton variant="plain">
								<MoreHorizRounded />
							</MenuButton>
							<Menu>
								<MenuItem color="primary" onClick={() => regenerateToken(token.token_id)}>
									<ListItemDecorator><RefreshRounded /></ListItemDecorator>
									<ListItemContent>Regenerate</ListItemContent>
								</MenuItem>

								<MenuItem color="danger" onClick={() => deleteToken(token.token_id)}>
									<ListItemDecorator><DeleteForeverRounded /></ListItemDecorator>
									<ListItemContent>Delete</ListItemContent>
								</MenuItem>
							</Menu>
						</Dropdown>
					</td>
				</tr>
			);
		});
	}

	return (
		<Box>

			<Modal open={createdToken !== ""} onClose={() => {
				setShareXFile('');
				setCreatedToken("")
			}}>
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

							<Button onClick={() => Auth.shared.setUploadToken(createdToken)} color="primary">Set as web upload token</Button>

							<Typography>
								<Button onClick={() => navigator.clipboard.writeText(shareXFile) }>Copy ShareX File</Button><br />
								Save the file as a .sxcu file and double click on it. This will open it in ShareX and add the configuration to your custom uploader list.
							</Typography>
						</Stack>
					</DialogContent>
				</ModalDialog>
			</Modal>

			<Modal open={createTokenModal} onClose={() => {
				setCreateTokenModal(false);
				setTokenName('');
				setTokenDescription('');
				setTokenMaxUses(1);
			}}>
				<ModalDialog>
					<DialogTitle>Create token</DialogTitle>
					<DialogContent>Fill in the details below to create a new token.</DialogContent>

					<form onSubmit={(e) => {
						e.preventDefault();
						createToken();
						setCreateTokenModal(false);
					}}>
						<Stack spacing={2}>
							<FormControl>
								<FormLabel>Name</FormLabel>
								<Input type="text" autoFocus required onChange={(e) => setTokenName(e.target.value)} />
							</FormControl>

							<FormControl>
								<FormLabel>Description</FormLabel>
								<Input type="text" required onChange={(e) => setTokenDescription(e.target.value)} />
							</FormControl>

							<FormControl>
								<FormLabel>Max Uses</FormLabel>
								<Input type="number" required onChange={(e) => setTokenMaxUses(parseInt(e.target.value))} />
							</FormControl>

							<Button type="submit" color="primary">Create</Button>

							<Button color="neutral" variant="plain" onClick={() => setCreateTokenModal(false)}>Cancel</Button>
						</Stack>
					</form>
				</ModalDialog>
			</Modal>

			<Stack sx={{mb: "30px"}} direction="row" justifyContent="space-between" alignItems="center">
				<Typography level="h1">Upload Tokens</Typography>

				<Stack spacing={3} direction={"row"}>
					<Button variant="solid" onClick={() => setCreateTokenModal(true)} color="primary" startDecorator={<AddRounded />}>Create Token</Button>
					<Button variant="outlined" onClick={() => Auth.shared.fetchUploadTokens()} color="primary"><RefreshRounded /></Button>
				</Stack>
			</Stack>

			<Table sx={{
				'& thead th:nth-child(1)': { width: '15%' },
				'& thead th:nth-child(2)': { width: '120px' },
				'& thead th:nth-child(3)': { width: '300px' },
				'& thead th:nth-child(4)': { width: '15%' },
				'& thead th:nth-child(5)': { width: '15%' },
				'& thead th:nth-child(6)': { width: '7%' }
			}}>
				<thead>
					<tr>
						<th>Id</th>
						<th>Name</th>
						<th>Description</th>
						<th>Created At</th>
						<th>Uses/Max Uses</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{createTokenTable()}
				</tbody>
			</Table>

		</Box>
	);
}