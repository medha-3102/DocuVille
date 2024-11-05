import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [extractedData, setExtractedData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setExtractedData(null);

        if (!selectedFile) {
            setError("Please select a file to upload");
            return;
        }

        const validFileTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validFileTypes.includes(selectedFile.type)) {
            setError("Please upload a valid image file (JPEG, PNG, GIF)");
            return;
        }

        const formData = new FormData();
        formData.append("document", selectedFile);

        setLoading(true);
        try {
            const response = await axios.post("http://localhost:5000/extract", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setExtractedData(response.data.data);
        } catch (err) {
            setError("Failed to extract data from the document");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container" style={styles.container}>
            <div className="container d-flex flex-column flex-lg-row align-items-center justify-content-center min-vh-100">
                <div className="col-lg-6 order-1 order-lg-1 mt-4 mt-lg-0 mb-4 mb-lg-0">
                    <h2 className="mb-4 text-center" style={styles.heading}>
                        DocuVille
                    </h2>
                    <p className="text-center quote">
                        <span>"Transforming documents into data, one upload at a time."</span>
                    </p>
                    <div className="card shadow-lg rounded" style={styles.card}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="file-upload" className="form-label">Upload Document</label>
                                    <input 
                                        id="file-upload"
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange} 
                                        className="form-control" 
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Extracting..." : "Extract Data"}
                                </button>
                            </form>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            {extractedData && (
                                <div className="mt-3">
                                    <h5 className="text-success">Extracted Data:</h5>
                                    <div className="border p-3 rounded bg-light">
                                        <p><strong>Name:</strong> {extractedData.name}</p>
                                        <p><strong>Document Number:</strong> {extractedData.documentNumber}</p>
                                        <p><strong>Expiration Date:</strong> {extractedData.expirationDate}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="col-lg-6 order-2 order-lg-2 px-lg-3">
                    <img 
                        src="https://www.innovatrics.com/wp-content/uploads/2020/05/Baner_OCR_V2_detail.gif" 
                        alt="Document Extraction" 
                        className="img-fluid" 
                        style={styles.image} 
                    />
                </div>
            </div>
        </div>
    );
}


const styles = {
    container: {
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '20px',
        borderRadius: '10px',
    },
    image: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    heading: {
        fontFamily: 'cursive',
        background: 'linear-gradient(135deg, #6e45e2, #88d3ce)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
};

// Exporting the App component
export default App;
