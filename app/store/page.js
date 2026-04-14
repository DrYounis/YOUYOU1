'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { compressImage, formatFileSize } from '../../lib/imageCompression';
import { uploadImageToStorage } from '../../lib/supabaseUpload';
import { submitOrder } from '../../lib/supabaseOrders';

export default function StorePage() {
    const router = useRouter();
    const fileInputRef = useRef(null);
    const [step, setStep] = useState(1); // 1: Upload, 2: Details, 3: Payment, 4: Confirm

    // Upload state
    const [uploadedImage, setUploadedImage] = useState(null);
    const [compressedBlob, setCompressedBlob] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [originalSize, setOriginalSize] = useState(0);

    // Form state
    const [formData, setFormData] = useState({
        customerName: '',
        phone: '',
        email: '',
        deliveryType: 'school',
        schoolName: '',
        homeAddress: '',
        homeCity: '',
        homePhone: '',
    });

    // Payment state
    const [paymentMethod, setPaymentMethod] = useState('');

    // Errors
    const [errors, setErrors] = useState({});

    // Loading
    const [submitting, setSubmitting] = useState(false);

    const PRICE = 50;
    const CURRENCY = 'SAR';

    // Handle file upload
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setErrors({ file: 'Please upload an image file (JPG, PNG, etc.)' });
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            setErrors({ file: 'Image must be less than 10MB' });
            return;
        }

        setOriginalSize(file.size);
        setCompressing(true);
        setErrors({});

        // Create preview
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);

        try {
            // Compress image
            const compressed = await compressImage(file, 800, 800, 0.7);
            setUploadedImage(file);
            setCompressedBlob(compressed);
        } catch (err) {
            setErrors({ file: 'Failed to process image. Please try again.' });
        } finally {
            setCompressing(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate step 1 (upload)
    const validateStep1 = () => {
        if (!uploadedImage) {
            setErrors({ file: 'Please upload a photo for your puzzle' });
            return false;
        }
        return true;
    };

    // Validate step 2 (details)
    const validateStep2 = () => {
        const newErrors = {};
        if (!formData.customerName.trim()) newErrors.customerName = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

        if (formData.deliveryType === 'home') {
            if (!formData.homeAddress.trim()) newErrors.homeAddress = 'Address is required for home delivery';
            if (!formData.homeCity.trim()) newErrors.homeCity = 'City is required';
        } else {
            if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate step 3 (payment)
    const validateStep3 = () => {
        if (!paymentMethod) {
            setErrors({ payment: 'Please select a payment method' });
            return false;
        }
        return true;
    };

    // Navigation
    const nextStep = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
        else if (step === 3 && validateStep3()) setStep(4);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // Submit order
    const handleSubmitOrder = async () => {
        setSubmitting(true);
        setErrors({});

        try {
            // Upload image to Firebase Storage
            const imageUrl = await uploadImageToStorage(compressedBlob, formData.customerName);

            // Submit order to Firestore
            const orderId = await submitOrder({
                imageUrl,
                customerName: formData.customerName,
                phone: formData.phone,
                email: formData.email,
                deliveryType: formData.deliveryType,
                schoolName: formData.deliveryType === 'school' ? formData.schoolName : null,
                homeAddress: formData.deliveryType === 'home' ? formData.homeAddress : null,
                homeCity: formData.deliveryType === 'home' ? formData.homeCity : null,
                homePhone: formData.deliveryType === 'home' ? formData.homePhone : null,
                paymentMethod,
                price: PRICE,
                currency: CURRENCY,
                status: paymentMethod === 'apple_pay' ? 'paid' : 'pending',
                createdAt: new Date().toISOString(),
            });

            // Navigate to thank you page
            router.push(`/store/thank-you?orderId=${orderId}`);
        } catch (err) {
            console.error('Order submission error:', err);
            setErrors({ submit: 'Failed to submit order. Please check your connection and try again.' });
        } finally {
            setSubmitting(false);
        }
    };

    // Trigger file input
    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <h1 style={styles.title}>🧩 Younis Store</h1>
                    <p style={styles.subtitle}>Create Your Own Puzzle!</p>
                </div>

                {/* Progress Steps */}
                <div style={styles.progressContainer}>
                    {['Upload Photo', 'Your Details', 'Payment', 'Confirm'].map((label, i) => (
                        <div key={label} style={styles.progressStep}>
                            <div style={{
                                ...styles.progressCircle,
                                backgroundColor: step > i + 1 ? '#4CAF50' : step === i + 1 ? '#FF6B6B' : '#E0E0E0',
                                color: step >= i + 1 ? '#fff' : '#999',
                            }}>
                                {step > i + 1 ? '✓' : i + 1}
                            </div>
                            <span style={{
                                ...styles.progressLabel,
                                color: step === i + 1 ? '#FF6B6B' : '#666',
                                fontWeight: step === i + 1 ? 'bold' : 'normal',
                            }}>
                                {label}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Step Content */}
                <div style={styles.card}>
                    {/* STEP 1: Upload */}
                    {step === 1 && (
                        <div style={styles.stepContent}>
                            <h2 style={styles.stepTitle}>📸 Upload Your Photo</h2>
                            <p style={styles.stepDesc}>Choose a photo to be printed on your custom puzzle!</p>

                            <div
                                style={{
                                    ...styles.uploadArea,
                                    borderColor: errors.file ? '#f44336' : '#ddd',
                                }}
                                onClick={triggerUpload}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />

                                {compressing ? (
                                    <div style={styles.compressing}>
                                        <div style={styles.spinner}></div>
                                        <p>Compressing your image...</p>
                                    </div>
                                ) : previewUrl ? (
                                    <div style={styles.previewContainer}>
                                        <img src={previewUrl} alt="Preview" style={styles.previewImage} />
                                        <div style={styles.previewInfo}>
                                            <p style={styles.previewText}>✅ Image uploaded!</p>
                                            <p style={styles.previewText}>
                                                Original: {formatFileSize(originalSize)}
                                                {compressedBlob && ` → Compressed: ${formatFileSize(compressedBlob.size)}`}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={styles.uploadPlaceholder}>
                                        <span style={{ fontSize: '4rem' }}>🖼️</span>
                                        <p style={styles.uploadText}>Click to upload your photo</p>
                                        <p style={styles.uploadHint}>JPG, PNG up to 10MB</p>
                                    </div>
                                )}
                            </div>

                            {errors.file && <p style={styles.errorText}>{errors.file}</p>}

                            <div style={styles.priceTag}>
                                <span style={styles.priceLabel}>Price:</span>
                                <span style={styles.priceValue}>{PRICE} {CURRENCY}</span>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Details */}
                    {step === 2 && (
                        <div style={styles.stepContent}>
                            <h2 style={styles.stepTitle}>👤 Your Details</h2>
                            <p style={styles.stepDesc}>Tell us how to reach you and where to deliver!</p>

                            <div style={styles.formGrid}>
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Your Name *</label>
                                    <input
                                        type="text"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your name"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.customerName ? '#f44336' : '#ddd',
                                        }}
                                    />
                                    {errors.customerName && <p style={styles.errorText}>{errors.customerName}</p>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="05XXXXXXXX"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.phone ? '#f44336' : '#ddd',
                                        }}
                                    />
                                    {errors.phone && <p style={styles.errorText}>{errors.phone}</p>}
                                </div>

                                <div style={styles.formGroup}>
                                    <label style={styles.label}>Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.email ? '#f44336' : '#ddd',
                                        }}
                                    />
                                    {errors.email && <p style={styles.errorText}>{errors.email}</p>}
                                </div>
                            </div>

                            {/* Delivery Options */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Delivery Method *</label>
                                <div style={styles.deliveryOptions}>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'school' }))}
                                        style={{
                                            ...styles.deliveryOption,
                                            backgroundColor: formData.deliveryType === 'school' ? '#E3F2FD' : '#fff',
                                            borderColor: formData.deliveryType === 'school' ? '#2196F3' : '#ddd',
                                        }}
                                    >
                                        <span style={{ fontSize: '2rem' }}>🏫</span>
                                        <span>Pick up at School</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, deliveryType: 'home' }))}
                                        style={{
                                            ...styles.deliveryOption,
                                            backgroundColor: formData.deliveryType === 'home' ? '#E3F2FD' : '#fff',
                                            borderColor: formData.deliveryType === 'home' ? '#2196F3' : '#ddd',
                                        }}
                                    >
                                        <span style={{ fontSize: '2rem' }}>🏠</span>
                                        <span>Home Delivery</span>
                                    </button>
                                </div>
                            </div>

                            {/* School fields */}
                            {formData.deliveryType === 'school' && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>School Name *</label>
                                    <input
                                        type="text"
                                        name="schoolName"
                                        value={formData.schoolName}
                                        onChange={handleInputChange}
                                        placeholder="Enter school name"
                                        style={{
                                            ...styles.input,
                                            borderColor: errors.schoolName ? '#f44336' : '#ddd',
                                        }}
                                    />
                                    {errors.schoolName && <p style={styles.errorText}>{errors.schoolName}</p>}
                                </div>
                            )}

                            {/* Home delivery fields */}
                            {formData.deliveryType === 'home' && (
                                <div style={styles.formGrid}>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Full Address *</label>
                                        <textarea
                                            name="homeAddress"
                                            value={formData.homeAddress}
                                            onChange={handleInputChange}
                                            placeholder="Street, building, apartment..."
                                            rows={3}
                                            style={{
                                                ...styles.input,
                                                ...styles.textarea,
                                                borderColor: errors.homeAddress ? '#f44336' : '#ddd',
                                            }}
                                        />
                                        {errors.homeAddress && <p style={styles.errorText}>{errors.homeAddress}</p>}
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>City *</label>
                                        <input
                                            type="text"
                                            name="homeCity"
                                            value={formData.homeCity}
                                            onChange={handleInputChange}
                                            placeholder="City"
                                            style={{
                                                ...styles.input,
                                                borderColor: errors.homeCity ? '#f44336' : '#ddd',
                                            }}
                                        />
                                        {errors.homeCity && <p style={styles.errorText}>{errors.homeCity}</p>}
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label style={styles.label}>Delivery Phone</label>
                                        <input
                                            type="tel"
                                            name="homePhone"
                                            value={formData.homePhone}
                                            onChange={handleInputChange}
                                            placeholder="Contact phone for delivery"
                                            style={styles.input}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: Payment */}
                    {step === 3 && (
                        <div style={styles.stepContent}>
                            <h2 style={styles.stepTitle}>💳 Payment Method</h2>
                            <p style={styles.stepDesc}>Choose how you'd like to pay</p>

                            <div style={styles.orderSummary}>
                                <h3 style={styles.summaryTitle}>Order Summary</h3>
                                <div style={styles.summaryRow}>
                                    <span>Custom Puzzle - "My Puzzle"</span>
                                    <span>{PRICE} {CURRENCY}</span>
                                </div>
                                <div style={styles.summaryTotal}>
                                    <span>Total</span>
                                    <span>{PRICE} {CURRENCY}</span>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Select Payment Method *</label>
                                <div style={styles.paymentOptions}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod('bank_transfer');
                                            setErrors({});
                                        }}
                                        style={{
                                            ...styles.paymentOption,
                                            backgroundColor: paymentMethod === 'bank_transfer' ? '#E8F5E9' : '#fff',
                                            borderColor: paymentMethod === 'bank_transfer' ? '#4CAF50' : '#ddd',
                                        }}
                                    >
                                        <span style={{ fontSize: '2.5rem' }}>🏦</span>
                                        <span style={styles.paymentOptionTitle}>Bank Transfer</span>
                                        <span style={styles.paymentOptionDesc}>
                                            Transfer to our account. Payment will be confirmed manually.
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod('apple_pay');
                                            setErrors({});
                                        }}
                                        style={{
                                            ...styles.paymentOption,
                                            backgroundColor: paymentMethod === 'apple_pay' ? '#E8F5E9' : '#fff',
                                            borderColor: paymentMethod === 'apple_pay' ? '#000' : '#ddd',
                                        }}
                                    >
                                        <span style={{ fontSize: '2.5rem' }}>🍎</span>
                                        <span style={styles.paymentOptionTitle}>Apple Pay</span>
                                        <span style={styles.paymentOptionDesc}>
                                            Pay instantly with Apple Pay.
                                        </span>
                                    </button>
                                </div>
                                {errors.payment && <p style={styles.errorText}>{errors.payment}</p>}
                            </div>

                            {/* Bank Transfer Details */}
                            {paymentMethod === 'bank_transfer' && (
                                <div style={styles.bankDetails}>
                                    <h4 style={styles.bankTitle}>🏦 Bank Transfer Details</h4>
                                    <div style={styles.bankRow}>
                                        <span style={styles.bankLabel}>Bank:</span>
                                        <span style={styles.bankValue}>Al Rajhi Bank</span>
                                    </div>
                                    <div style={styles.bankRow}>
                                        <span style={styles.bankLabel}>Account Name:</span>
                                        <span style={styles.bankValue}>Younis Store</span>
                                    </div>
                                    <div style={styles.bankRow}>
                                        <span style={styles.bankLabel}>IBAN:</span>
                                        <span style={styles.bankValue}>SA00 0000 0000 0000 0000 0000</span>
                                    </div>
                                    <div style={styles.bankRow}>
                                        <span style={styles.bankLabel}>Amount:</span>
                                        <span style={styles.bankValue}>{PRICE} {CURRENCY}</span>
                                    </div>
                                    <p style={styles.bankNote}>
                                        ⚠️ After transfer, your order will be pending until we confirm payment.
                                        We will contact you via the phone/email you provided.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 4: Confirm */}
                    {step === 4 && (
                        <div style={styles.stepContent}>
                            <h2 style={styles.stepTitle}>✅ Review & Confirm</h2>
                            <p style={styles.stepDesc}>Please review your order before submitting</p>

                            <div style={styles.reviewSection}>
                                <div style={styles.reviewCard}>
                                    <h3 style={styles.reviewTitle}>📸 Your Photo</h3>
                                    {previewUrl && (
                                        <img src={previewUrl} alt="Your puzzle photo" style={styles.reviewImage} />
                                    )}
                                </div>

                                <div style={styles.reviewCard}>
                                    <h3 style={styles.reviewTitle}>👤 Your Details</h3>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Name:</span>
                                        <span>{formData.customerName}</span>
                                    </div>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Phone:</span>
                                        <span>{formData.phone}</span>
                                    </div>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Email:</span>
                                        <span>{formData.email}</span>
                                    </div>
                                </div>

                                <div style={styles.reviewCard}>
                                    <h3 style={styles.reviewTitle}>🚚 Delivery</h3>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Method:</span>
                                        <span>{formData.deliveryType === 'school' ? '🏫 School Pickup' : '🏠 Home Delivery'}</span>
                                    </div>
                                    {formData.deliveryType === 'school' && (
                                        <div style={styles.reviewRow}>
                                            <span style={styles.reviewLabel}>School:</span>
                                            <span>{formData.schoolName}</span>
                                        </div>
                                    )}
                                    {formData.deliveryType === 'home' && (
                                        <>
                                            <div style={styles.reviewRow}>
                                                <span style={styles.reviewLabel}>Address:</span>
                                                <span>{formData.homeAddress}, {formData.homeCity}</span>
                                            </div>
                                            {formData.homePhone && (
                                                <div style={styles.reviewRow}>
                                                    <span style={styles.reviewLabel}>Delivery Phone:</span>
                                                    <span>{formData.homePhone}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div style={styles.reviewCard}>
                                    <h3 style={styles.reviewTitle}>💳 Payment</h3>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Method:</span>
                                        <span>{paymentMethod === 'bank_transfer' ? '🏦 Bank Transfer' : '🍎 Apple Pay'}</span>
                                    </div>
                                    <div style={styles.reviewRow}>
                                        <span style={styles.reviewLabel}>Amount:</span>
                                        <span style={styles.reviewTotal}>{PRICE} {CURRENCY}</span>
                                    </div>
                                </div>
                            </div>

                            {errors.submit && <p style={styles.errorText}>{errors.submit}</p>}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div style={styles.buttonRow}>
                        {step > 1 && step < 4 && (
                            <button onClick={prevStep} style={styles.btnSecondary}>
                                ← Back
                            </button>
                        )}
                        {step < 3 && (
                            <button onClick={nextStep} style={styles.btnPrimary}>
                                Next →
                            </button>
                        )}
                        {step === 3 && (
                            <button onClick={nextStep} style={styles.btnPrimary}>
                                Review Order →
                            </button>
                        )}
                        {step === 4 && (
                            <button
                                onClick={handleSubmitOrder}
                                disabled={submitting}
                                style={{
                                    ...styles.btnPrimary,
                                    opacity: submitting ? 0.7 : 1,
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                }}
                            >
                                {submitting ? '⏳ Submitting...' : `🎉 Place Order - ${PRICE} ${CURRENCY}`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Styles
const styles = {
    page: {
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
    },
    container: {
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    title: {
        fontSize: '2.5rem',
        color: '#fff',
        marginBottom: '0.5rem',
        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
    },
    subtitle: {
        fontSize: '1.2rem',
        color: 'rgba(255,255,255,0.9)',
    },
    progressContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '2rem',
        padding: '0 1rem',
    },
    progressStep: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
    },
    progressCircle: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        transition: 'all 0.3s ease',
    },
    progressLabel: {
        fontSize: '0.85rem',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    },
    stepContent: {
        marginBottom: '2rem',
    },
    stepTitle: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '0.5rem',
    },
    stepDesc: {
        color: '#666',
        marginBottom: '1.5rem',
    },
    uploadArea: {
        border: '3px dashed',
        borderRadius: '15px',
        padding: '2rem',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        marginBottom: '1rem',
    },
    uploadPlaceholder: {
        padding: '2rem',
    },
    uploadText: {
        fontSize: '1.2rem',
        color: '#666',
        marginTop: '1rem',
    },
    uploadHint: {
        fontSize: '0.9rem',
        color: '#999',
    },
    previewContainer: {
        textAlign: 'center',
    },
    previewImage: {
        maxWidth: '100%',
        maxHeight: '300px',
        borderRadius: '10px',
        margin: '0 auto',
    },
    previewInfo: {
        marginTop: '1rem',
    },
    previewText: {
        color: '#4CAF50',
        fontSize: '0.95rem',
    },
    compressing: {
        padding: '2rem',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #f3f3f3',
        borderTop: '4px solid #FF6B6B',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 1rem',
    },
    priceTag: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        backgroundColor: '#FFF3E0',
        borderRadius: '10px',
        marginTop: '1rem',
    },
    priceLabel: {
        fontSize: '1.2rem',
        color: '#666',
    },
    priceValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    formGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    formGroup: {
        marginBottom: '1rem',
    },
    label: {
        display: 'block',
        marginBottom: '0.5rem',
        color: '#333',
        fontWeight: '600',
    },
    input: {
        width: '100%',
        padding: '0.75rem 1rem',
        border: '2px solid #ddd',
        borderRadius: '10px',
        fontSize: '1rem',
        transition: 'border-color 0.3s ease',
        outline: 'none',
    },
    textarea: {
        resize: 'vertical',
        fontFamily: 'inherit',
    },
    errorText: {
        color: '#f44336',
        fontSize: '0.85rem',
        marginTop: '0.25rem',
    },
    deliveryOptions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
    },
    deliveryOption: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        border: '2px solid',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        gap: '0.5rem',
    },
    paymentOptions: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
    },
    paymentOption: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.5rem',
        border: '2px solid',
        borderRadius: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        gap: '0.5rem',
    },
    paymentOptionTitle: {
        fontSize: '1.2rem',
        fontWeight: '600',
        color: '#333',
    },
    paymentOptionDesc: {
        fontSize: '0.9rem',
        color: '#666',
        textAlign: 'center',
    },
    orderSummary: {
        backgroundColor: '#F5F5F5',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
    },
    summaryTitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '1rem',
    },
    summaryRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        color: '#666',
    },
    summaryTotal: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 0 0',
        marginTop: '0.5rem',
        borderTop: '2px solid #ddd',
        fontWeight: 'bold',
        fontSize: '1.2rem',
        color: '#333',
    },
    bankDetails: {
        backgroundColor: '#E8F5E9',
        borderRadius: '15px',
        padding: '1.5rem',
        marginTop: '1rem',
    },
    bankTitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '1rem',
    },
    bankRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
    },
    bankLabel: {
        color: '#666',
    },
    bankValue: {
        fontWeight: '600',
        color: '#333',
    },
    bankNote: {
        marginTop: '1rem',
        padding: '0.75rem',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '8px',
        fontSize: '0.9rem',
        color: '#666',
    },
    reviewSection: {
        display: 'grid',
        gap: '1rem',
    },
    reviewCard: {
        backgroundColor: '#F9F9F9',
        borderRadius: '15px',
        padding: '1.5rem',
    },
    reviewTitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '1rem',
    },
    reviewImage: {
        maxWidth: '100%',
        maxHeight: '250px',
        borderRadius: '10px',
        margin: '0 auto',
    },
    reviewRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0.5rem 0',
        borderBottom: '1px solid #eee',
    },
    reviewLabel: {
        color: '#666',
        fontWeight: '600',
    },
    reviewTotal: {
        fontSize: '1.3rem',
        fontWeight: 'bold',
        color: '#FF6B6B',
    },
    buttonRow: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        marginTop: '2rem',
    },
    btnPrimary: {
        flex: 1,
        padding: '1rem 2rem',
        backgroundColor: '#FF6B6B',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    btnSecondary: {
        flex: 1,
        padding: '1rem 2rem',
        backgroundColor: '#f5f5f5',
        color: '#666',
        border: '2px solid #ddd',
        borderRadius: '10px',
        fontSize: '1.1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

// Add spinner animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    if (!document.querySelector('[data-spinner-style]')) {
        style.setAttribute('data-spinner-style', 'true');
        document.head.appendChild(style);
    }
}
