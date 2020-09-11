import React from "react";
import styles from "../../css/shared/Embed.module.scss";
import { PropTypes } from "prop-types";
import { isEmptyVal } from "../../helpers/utils_types";

// available styles
const SIZES = {
	XSM: {
		width: "10rem",
		height: "8rem",
		fontSize: "1rem"
	},
	SM: {
		width: "20rem",
		height: "16rem",
		fontSize: "1.2rem"
	},
	MD: {
		width: "40rem",
		height: "32rem",
		fontSize: "1.5rem"
	},
	LG: {
		width: "60rem",
		height: "40rem",
		fontSize: "1.8rem"
	},
	XLG: {
		width: "80rem",
		height: "60rem",
		fontSize: "2rem"
	},
	HALF: {
		width: "50%",
		height: "50%",
		fontSize: "1.5rem"
	},
	FULL: {
		width: "100%",
		height: "100%",
		fontSize: "2rem"
	},
	MAX: {
		width: "100vw",
		height: "100vh",
		fontSize: "2rem"
	}
};

// available types
const TYPES = {
	TEXT: {
		CSV: "text/csv",
		HTML: "text/html",
		JS: "text/javascript",
		MD: "text/markdown",
		RTF: "text/rtf",
		XML: "text/xml",
		DOC: "vnd.sealed.doc",
		PPT: "vnd.sealed.ppt",
		XLS: "vnd.sealed.xls"
	},
	IMAGE: {
		BMP: "image/bmp",
		GIF: "image/gif",
		JPEG: "image/jpeg",
		PNG: "image/png",
		PHOTOSHOP: "image/vnd.adobe.photoshop"
	},
	APPLICATION: {
		PDF: "application/pdf",
		FORM_ENCODED: "application/x-www-form-urlencoded",
		OCTET_STREAM: "application/octet-stream",
		RTF: "application/rtf",
		SQL: "application/sql",
		XML: "application/xml",
		ZIP: "application/zip",
		FLASH_MOVIE: "application/vnd.adobe.flash.movie",
		BALSAMIQ: "application/vnd.balsamiq.bmml+xml",
		APPLE: {
			KEYNOTE: "application/vnd.apple.keynote",
			NUMBERS: "application/vnd.apple.numbers",
			PAGES: "application/vnd.apple.pages"
		},
		MSFT: {
			EXCEL: "application/vnd.ms-excel",
			POWERPOINT: "application/vnd.ms-powerpoint"
		}
	},
	VIDEO: {
		JPEG: "video/jpeg",
		MP4: "video/mp4",
		MPV: "video/mpv",
		MPEG: "video/mpeg4-generic",
		OGG: "video/ogg",
		QUICKTIME: "video/quicktime",
		VND: {
			YOUTUBE: "video/vnd.youtube.yt",
			VIVO: "video/vnd.vivo",
			MP4: "video/vnd.uvvu.mp4"
		}
	},
	AUDIO: {
		AAC: "audio/aac",
		MPA: "audio/mpa",
		MP4: "audio/mp4",
		MPEG: "audio/mpeg",
		MPEG4: "audio/mpeg4-generic",
		OGG: "audio/ogg"
	},
	MULTIPART: {
		FORM_DATA: "multipart/form-data",
		HEADER_SET: "multipart/header-set",
		ENCRYPTED: "multipart/encrypted",
		RELATED: "multipart/related",
		SIGNED: "multipart/signed",
		VOICE_MESSAGE: "multipart/voice-message"
	}
};

const Embed = ({
	src,
	type = "application/pdf",
	size = "FULL",
	customWidth,
	customHeight,
	placeholder = "No Content Loaded",
	children
}) => {
	if (isEmptyVal(src)) {
		return (
			<section className={styles.Embed} style={SIZES[size]}>
				<h4
					className={styles.Embed_placeholder}
					style={{
						fontSize: "1.6rem",
						fontFamily: "Raleway, Roboto, sans-serif",
						textAlign: "center"
					}}
				>
					{placeholder}
				</h4>
				<div className={styles.Embed_fallback}>{children}</div>
			</section>
		);
	}
	return (
		<>
			<section className={styles.Embed} style={SIZES[size]}>
				<embed
					className={styles.Embed_mirror}
					src={src}
					type={type}
					style={SIZES[size]}
					width={customWidth}
					height={customHeight}
				/>
			</section>
		</>
	);
};

export default Embed;

Embed.defaultProps = {
	type: "application/pdf",
	size: "FULL",
	placeholder: "No Content Loaded"
};

Embed.propTypes = {
	src: PropTypes.string.isRequired,
	type: PropTypes.string.isRequired,
	customWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	customHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
