import { ImageProps, Image as I, Skeleton, SkeletonProps } from "@mantine/core";
import { useState } from "react";

export default function Image(
	props: ImageProps & {
		skeletonProps?: SkeletonProps;
	}
) {
	const [imageLoaded, setImageLoaded] = useState(false);

	return (
		<>
			<Skeleton {...props.skeletonProps} visible={!imageLoaded}>
				<I {...props} onLoad={() => setImageLoaded(true)} />
			</Skeleton>
		</>
	);
}
