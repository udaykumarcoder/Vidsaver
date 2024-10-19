import "./Home.css";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Details from "./Details/Details";
import Footer from "./Footer/Footer";
import Header from "./Header";

const Home = () => {
    const [link, setLink] = useState("");
    const [type, setType] = useState("");
    const [urlVideo, setUrlVideo] = useState();
    const [errorMessage, setErrorMessage] = useState("");

    function changeType(e) {
        setType(e.target.value);
        console.log("Stream type selected:", e.target.value); // Log stream type
    }

    function changeLink(e) {
        setLink(e.target.value);
        console.log("Input link changed:", e.target.value); // Log input link change
    }

    async function downloadInstagram() {
        try {
            const response = await axios.get(`http://localhost:5000/download-instagram-video?url=${link}`);
            console.log("Instagram download response:", response.data); // Log response data
            setUrlVideo(response.data.videoUrl);
            setErrorMessage("");
        } catch (error) {
            console.error("Error downloading Instagram video:", error); // Log error
            setErrorMessage("Invalid Instagram URL");
            toast.warn("Invalid URL");
        }
    }

    async function downloadFacebook() {
        try {
            const response = await axios.get(`http://localhost:5000/download-fb-video?url=${link}`);
            console.log("Facebook download response:", response.data); // Log response data
            setUrlVideo(response.data.videoUrl);
            setErrorMessage("");
        } catch (error) {
            console.error("Error downloading Facebook video:", error); // Log error
            setErrorMessage("Invalid Facebook URL");
            toast.warn("Invalid URL");
        }
    }

    function convert(event) {
        if (!link) {
            toast.warn("URL cannot be empty");
            setErrorMessage("URL cannot be empty");
            event.preventDefault();
            return;
        }
        if (!type) {
            toast.warn("Select a Stream");
            setErrorMessage("Select a Stream");
            event.preventDefault();
            return;
        } else {
            console.log("Converting video with type:", type); // Log the stream type being processed
            if (type === "Instagram") {
                downloadInstagram();
            } else if (type === "Facebook") {
                downloadFacebook();
            }
            return;
        }
    }

    const enter = (e) => {
        if (e.key === "Enter") {
            convert(e);
        }
    }

    async function videoDownload() {
        try {
            console.log("Attempting to download video from URL:", urlVideo); // Log the URL being downloaded
            let result = await fetch(urlVideo);
            if (!result.ok) {
                throw new Error("Failed to fetch video");
            }
            let file = await result.blob();
            let tempUrl = URL.createObjectURL(file);
            let anchorTag = document.createElement("a");
            anchorTag.href = tempUrl;
            anchorTag.download = "download.mp4"; // Consider adding video title or ID
            document.body.appendChild(anchorTag);
            anchorTag.click();
            anchorTag.remove();
            setTimeout(() => URL.revokeObjectURL(tempUrl), 100); // Clean up the URL after a short delay
            console.log("Video downloaded successfully."); // Log success message
        } catch (error) {
            console.error("Error while downloading:", error); // Log error during download
        }
    }

    return (
        <>
            <Header />
            <div className="main-bg">
                <div className="main-outside">
                    <div className="main-inside">
                        <h1>Video Downloader</h1>
                        <p>Download videos from Instagram and Facebook</p> {/* Updated text */}
                        <div className="input-outer">
                            <div className="input-container">
                                <input type="text" placeholder="Insert link here" onKeyDown={enter} value={link} onChange={changeLink} id="video-link" />
                                <select value={type} onChange={changeType} className="paste-btn">
                                    <option value="">Select</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Facebook">Facebook</option>
                                    {/* Removed YouTube option */}
                                </select>
                                <button className="download-btn" onClick={convert}>Convert</button>
                            </div>
                        </div>
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                    </div>
                </div>
            </div>
            <ToastContainer position="top-right" pauseOnFocusLoss draggable autoClose={5000} pauseOnHover />
            {urlVideo && (
                <div className="video-container">
                    <h1 className="video-heading">Video Preview</h1>
                    <video controls src={urlVideo} type="video/mp4" height={500} width={300} />
                    <button className="download-button" onClick={videoDownload}>Download</button>
                </div>
            )}
            <Details />
            <Footer />
        </>
    );
}

export default Home;
