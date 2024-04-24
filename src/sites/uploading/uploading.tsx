import { Box, Button, Divider, FormControl, FormLabel, Input, Link, Sheet, Snackbar, Stack, Table, Typography } from "@mui/joy";
import React from "react";
import "./uploading.css";
import { DeleteRounded } from "@mui/icons-material";
import { formatBytes } from "../../util/formatBytes";
import { Auth } from "../../Shares/Auth";
import { Events } from "../../util/EventEmitter";

export class UploadFile {
	public password: string = "";
	public private: boolean = false;

	constructor(public file: File) {}
}

export default function Uploading() {

	const [files, setFiles] = React.useState<UploadFile[]>([]);

	const [successfulUploads, setSuccessfulUploads] = React.useState<number>(0);
	const [failedUploads, setFailedUploads] = React.useState<number>(0);

	const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);

	React.useEffect(() => {
		Auth.shared.subscribe(Events.UPLOAD_SUCCESSFUL, (_) => {
			setSuccessfulUploads(successfulUploads + 1);
			checkIfAllFilesUploaded();
		});

		Auth.shared.subscribe(Events.UPLOAD_FAILED, () => {
			setFailedUploads(failedUploads + 1);
			checkIfAllFilesUploaded();
		});
	}, []);

	function checkIfAllFilesUploaded() {
		if (files.length === successfulUploads + failedUploads) {
			setFiles([]);
			setShowSnackbar(true);
		}
	}
	
	async function uploadFile(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (files.length === 0) {
			alert('No files selected');
			return;
		}

		let uploads = files.map((file) => {
			return Auth.shared.uploadFile(file);
		});

		await Promise.all(uploads);
	}

	return (
		<Stack justifyContent={"center"} alignItems={"center"}>

			<Snackbar open={showSnackbar} autoHideDuration={3000} onClose={() => {
				setShowSnackbar(false)
				setSuccessfulUploads(0);
				setFailedUploads(0);
			}}>
				Uploaded {successfulUploads} files{failedUploads > 0 && <>, failed to upload {failedUploads} files</>}. You can view them in your <Link variant="plain" href="/profile/gallery">gallery</Link>.
			</Snackbar>

			<Sheet variant="glass" sx={{width: "1000px", minHeight: "200px", borderRadius: "sm"}}>
				<Stack sx={{padding: "10px"}} spacing={3}>
					<Typography level="h1">Uploading</Typography>

					<form onSubmit={uploadFile}>

						<FormControl>
							<FormLabel>File</FormLabel>
							<input type="file" required multiple id="upload-photo-picker" onChange={(e) => {
								if (e.target.files === null) {
									return;
								}

								let newFiles: UploadFile[] = [];

								for (let i = 0; i < e.target.files.length; i++) {
									newFiles.push(new UploadFile(e.target.files[i]));
								}

								setFiles([ ...files, ...newFiles ]);
							}} />
							<label
								htmlFor="upload-photo-picker"
								onDragOver={(e) => e.preventDefault()}
								onDragEnter={(e) => e.preventDefault()}
								onDrop={(e) => {
									e.preventDefault();

									let newFiles: UploadFile[] = [];

									for (let i = 0; i < e.dataTransfer.files.length; i++) {
										newFiles.push(new UploadFile(e.dataTransfer.files[i]));
									}

									setFiles([ ...files, ...newFiles ]);
								}}
							>
								<Sheet sx={{minHeight: "50px", maxHeight: "500px", overflowY: "scroll", borderRadius: "sm", alignItems: "center", justifyContent: "center"}} variant="outlined">
									<Stack sx={{p: "10px"}} spacing={1}>
										{files.length === 0 ? "Select files or drop them here" : <FileTable
											files={files}
											setSelectedFiles={(files: UploadFile[]) => setFiles(files)}
										/>}
									</Stack>
								</Sheet>
							</label>
						</FormControl>

						<Button sx={{mt: "30px"}} type="submit" color="primary">Upload</Button>

					</form>
				</Stack>
			</Sheet>
		</Stack>
	);
}

function FileTable({ files, setSelectedFiles }: { files: UploadFile[], setSelectedFiles: (files: UploadFile[]) => void }) {
	return (
		<Table sx={{
			'& thead th:nth-child(1)': { width: '100px' },
			'& thead th:nth-child(2)': { width: '220px' },
			'& thead th:nth-child(3)': { width: '120px' },
			'& thead th:nth-child(4)': { width: '120px' },
			'& thead th:nth-child(5)': { width: '200px' },
			'& thead th:nth-child(6)': {  }
		}}>
			<thead>
				<tr>
					<th>Preview</th>
					<th>Name</th>
					<th>Size</th>
					<th>Private?</th>
					<th>Password</th>
					<th>Delete</th>
				</tr>
			</thead>
			<tbody>
				{
					files.map((file: UploadFile) => {
						return (
							<tr key={file.file.name}>
								<td>
									<img src={URL.createObjectURL(file.file)} alt={file.file.name} style={{maxWidth: "70px", maxHeight: "50px"}} />
								</td>
								<td style={{textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap"}}>{file.file.name}</td>
								<td>{formatBytes(file.file.size)}</td>
								<td>
									<input type="checkbox" checked={file.private} onChange={(e) => {
										file.private = e.target.checked;
										setSelectedFiles([...files]);
									}} />
								</td>
								<td>
									<Input type="text" value={file.password} onChange={(e) => {
										file.password = e.target.value;
										setSelectedFiles([...files]);
									}} />
								</td>
								<td><Button variant="plain" color="danger" onClick={() => setSelectedFiles(files.filter((v) => v !== file))}><DeleteRounded /></Button></td>
							</tr>
						)
					})
				}
			</tbody>
		</Table>
	)
}