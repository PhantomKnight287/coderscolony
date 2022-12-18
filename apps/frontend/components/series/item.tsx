import { Series } from "~types/series.types";

interface ItemProps extends Series {}

export default function SeriesItem({
	author,
	blogs,
	createdAt,
	description,
	id,
	slug,
	userId,
}: ItemProps) {
	return (
		<div>
			<div>{id}</div>
			<div>{author.name}</div>
			<div>{blogs}</div>
			<div>{String(createdAt)}</div>
			<div>{description}</div>
			<div>{slug}</div>
		</div>
	);
}
