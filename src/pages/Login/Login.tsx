import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '../../utils/navigation';

export default function Login() {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, sendOtp, verifyOtp } = useAuth();
  const { goHome } = useNavigation();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await sendOtp(phoneNumber);
      setStep('otp');
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await verifyOtp(phoneNumber, otp);
      login(response.data.accessToken, response.data.user.phoneNumber, response.data.user.id, response.data.refreshToken);
      goHome();
    } catch (error) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen min-w-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/icons/capitecLogo.svg" alt="Logo" className="h-12" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        
        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label htmlFor="phone" className="block font-semibold mb-2">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0812345678"
                pattern="[0-9]{10}"
                required
                disabled={loading}
                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block font-semibold mb-2">Enter OTP</label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                placeholder="123456"
                maxLength={6}
                required
                disabled={loading}
                className={`w-full border rounded px-3 py-2 disabled:opacity-50 ${error ? 'border-red-500' : 'border-gray-300'}`}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={() => setStep('phone')} 
              disabled={loading}
              className="w-full text-gray-600 disabled:opacity-50"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
