import { Button, Container } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";

function CreateNewForumModal() {
	const openCreateNewForumConfirmModal = () =>
		openConfirmModal({
			title: "Create A New Forum",
			centered: true,
		});
	return (
		<div>
			<Container size={500} className="mt-20">
				<Button onClick={openCreateNewForumConfirmModal}>Open</Button>
			</Container>
		</div>
	);
}

export default CreateNewForumModal;
