import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const settings = useQuery(api.integration.getSettings);
  const saveSettings = useMutation(api.integration.saveSettings);
  const connect = useMutation(api.integration.connect);
  const disconnect = useMutation(api.integration.disconnect);

  const [formData, setFormData] = useState({
    whatsappBusinessId: "",
    webhookUrl: "",
    apiKey: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        whatsappBusinessId: settings.whatsappBusinessId || "",
        webhookUrl: settings.webhookUrl || "",
        apiKey: settings.apiKey || "",
      });
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await saveSettings(formData);
    setIsSaving(false);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    await connect();
    setIsConnecting(false);
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111916] border border-emerald-500/20 rounded-2xl md:rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl shadow-emerald-500/10">
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-emerald-500/20">
          <h2 className="text-lg md:text-xl font-bold text-white">WhatsApp Integration</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Connection Status */}
          <div className={`mb-6 p-4 rounded-xl border ${
            settings?.isConnected
              ? "bg-emerald-500/10 border-emerald-500/30"
              : "bg-[#0a0f0d] border-emerald-500/20"
          }`}>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center ${
                  settings?.isConnected ? "bg-emerald-500" : "bg-gray-700"
                }`}>
                  <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                </div>
                <div>
                  <p className={`font-semibold text-sm md:text-base ${settings?.isConnected ? "text-emerald-400" : "text-gray-400"}`}>
                    {settings?.isConnected ? "Connected" : "Not Connected"}
                  </p>
                  {settings?.connectedAt && (
                    <p className="text-xs text-gray-500">
                      Since {new Date(settings.connectedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              {settings?.isConnected ? (
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl font-medium transition-all text-sm"
                >
                  Disconnect
                </button>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={isConnecting || !formData.whatsappBusinessId}
                  className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-400 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isConnecting ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>

          {/* Settings Form */}
          <form onSubmit={handleSave} className="space-y-4 md:space-y-5">
            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">
                WhatsApp Business ID
              </label>
              <input
                type="text"
                value={formData.whatsappBusinessId}
                onChange={(e) => setFormData({ ...formData, whatsappBusinessId: e.target.value })}
                placeholder="Enter your Business ID"
                className="w-full px-4 py-3 bg-[#0a0f0d] border border-emerald-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">
                Webhook URL
              </label>
              <input
                type="url"
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                placeholder="https://your-webhook-url.com"
                className="w-full px-4 py-3 bg-[#0a0f0d] border border-emerald-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs md:text-sm font-medium text-gray-300 uppercase tracking-wider">
                API Key
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-[#0a0f0d] border border-emerald-500/20 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all disabled:opacity-50 text-sm md:text-base"
              >
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>

          {/* Help Section */}
          <div className="mt-6 p-4 bg-[#0a0f0d] rounded-xl border border-emerald-500/10">
            <h3 className="font-semibold text-white text-sm md:text-base mb-2">Need Help?</h3>
            <p className="text-gray-500 text-xs md:text-sm">
              To integrate WhatsApp Business API, you'll need to set up a Meta Business account and configure your WhatsApp Business settings.
              <a href="https://developers.facebook.com/docs/whatsapp" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 ml-1">
                Learn more →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
