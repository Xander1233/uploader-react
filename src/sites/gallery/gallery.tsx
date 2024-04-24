import { AspectRatio, Box, Button, Checkbox, Dropdown, Link, ListItemContent, ListItemDecorator, Menu, MenuButton, MenuItem, Stack, Table, Typography } from "@mui/joy";
import React from "react";
import { Auth } from "../../Shares/Auth";
import { Events } from "../../util/EventEmitter";
import { Check, CheckBoxOutlineBlankRounded, CheckBoxRounded, DeleteForeverRounded, MoreHorizRounded, RefreshRounded } from "@mui/icons-material";
import { convertTimestamp } from "../../util/timestampConverter";
import { formatBytes } from "../../util/formatBytes";

export default function Gallery() {

	const [files, setFiles] = React.useState<any[]>([]);

	const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);

	const [profile, setProfile] = React.useState<any>(null);

	async function deleteFile(fileId: string) {

		if (files.find(file => file.id === fileId)?.is_avatar) {
			alert('Cannot delete avatar');
			return;
		}

		await Auth.shared.deleteFile(fileId);
		alert('Deleted file ' + fileId);
		Auth.shared.fetchGallery();
	}

	async function deleteSelectedFiles() {
		const filesToDelete: string[] = files.filter(file => selectedFiles.includes(file.id) && !file.is_avatar).map(file => file.id);
		
		await Promise.all(filesToDelete.map(async fileId => Auth.shared.deleteFile(fileId)));
		setSelectedFiles([]);
		alert('Deleted selected files');
		Auth.shared.fetchGallery();
	}

	React.useEffect(() => {
		Auth.shared.subscribe(Events.GALLERY_FETCHED, (gallery) => {
			setFiles(gallery);
		});

		Auth.shared.subscribe(Events.PROFILE_FETCHED, (profile) => {
			setProfile(profile);
		});

		Auth.shared.fetchGallery();
		Auth.shared.getProfile(true);
	}, []);

	return (
		<Stack direction={"column"} justifyContent={"center"} alignItems={"center"}>
			<Box>
				<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
					<Box>
						<Typography level="h1">Gallery</Typography>
					</Box>

					<Box>
						<Stack direction={"row"} spacing={5}>
							{selectedFiles.length > 0 && (
								<Button
									variant="solid"
									color="danger"
									onClick={() => {
										deleteSelectedFiles();
									}}
								>
									Delete selected ({selectedFiles.length})
								</Button>
							)}
							<Button
								variant="soft"
								color="primary"
								onClick={() => Auth.shared.fetchGallery()}
							>
								<RefreshRounded />
							</Button>
						</Stack>
					</Box>
				</Stack>

				<Table size="sm" sx={{
					'& thead th:nth-child(1)': { width: '3%' },
					'& thead th:nth-child(2)': { width: '13%' },
					'& thead th:nth-child(3)': { width: '30%' },
					'& thead th:nth-child(4)': { width: '8%' },
					'& thead th:nth-child(5)': { width: '10%' },
					'& thead th:nth-child(6)': { width: '15%' },
					'& thead th:nth-child(7)': { width: '15%' }
				}}>
					<thead>
						<tr>
							<th>
								<Checkbox
									checked={files.length > 0 && selectedFiles.length === files.length}
									indeterminate={selectedFiles.length > 0 && selectedFiles.length < files.length}
									onChange={(e) => {
										setSelectedFiles(e.target.checked ? files.map(file => file.id) : []);
									}}
								/>
							</th>
							<th>Id</th>
							<th>URL</th>
							<th>Is private?</th>
							<th>Has password?</th>
							<th>Filetype (Size)</th>
							<th>Created at</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{files.map((file, index) => {
							return (
								<tr key={file.id}>
									<td>
										<Checkbox
											checked={selectedFiles.includes(file.id)}
											onChange={(e) => {
												if (e.target.checked) {
													setSelectedFiles([...selectedFiles, file.id]);
												} else {
													setSelectedFiles(selectedFiles.filter(id => id !== file.id));
												}
											}}
										/>
									</td>
									<td>{file.id}</td>
									<td style={{width: "45%"}}><Link href={file.url} target="_blank">{profile?.custom_domain !== "" ? profile?.custom_domain : "sparkcloud.link"}/api/.../{file.id}</Link></td>
									<td>
										{file.is_private ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
									</td>
									<td>
										{file.has_password ? <CheckBoxRounded /> : <CheckBoxOutlineBlankRounded />}
									</td>
									<td>{file.filetype} ({formatBytes(file.size)})</td>
									<td>{convertTimestamp(file.created_at)}</td>
									<td>
									<Dropdown>
										<MenuButton variant="plain">
											<MoreHorizRounded />
										</MenuButton>
										<Menu>
											<MenuItem color="danger" onClick={() => deleteFile(file.id)}>
												<ListItemDecorator><DeleteForeverRounded /></ListItemDecorator>
												<ListItemContent>Delete</ListItemContent>
											</MenuItem>
										</Menu>
									</Dropdown>
									</td>
								</tr>
							);
						})}
					</tbody>
				</Table>
			</Box>
		</Stack>
	);
}