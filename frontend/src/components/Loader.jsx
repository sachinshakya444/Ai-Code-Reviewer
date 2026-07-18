import { motion } from "framer-motion";

const steps = [
  { icon: "🔗", text: "Connecting to GitHub", done: true },
  { icon: "📂", text: "Fetching PR diff & files", done: true },
  { icon: "🤖", text: "Gemini AI analyzing code...", done: false },
];

export default function Loader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 glass-card rounded-2xl p-8"
    >
      <div className="max-w-sm mx-auto text-center">

        {/* Animated Logo */}
        <div className="relative w-16 h-16 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-2 
                          border-blue-500/20 animate-ping" />
          <div className="absolute inset-0 rounded-full border-2 
                          border-purple-500/20 animate-ping" 
               style={{ animationDelay: "0.3s" }} />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br 
                          from-blue-600/20 to-purple-600/20 border 
                          border-white/10 flex items-center justify-center 
                          text-2xl">
            🔍
          </div>
        </div>

        {/* Text */}
        <h3 className="text-white font-semibold text-lg mb-1">
          Analyzing your PR
        </h3>
        <p className="text-white/40 text-sm mb-8">
          This may take 15-20 seconds for large PRs
        </p>

        {/* Steps */}
        <div className="space-y-3 text-left">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-center gap-3"
            >
              {/* Icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center 
                              justify-center text-sm flex-shrink-0
                              ${step.done
                                ? "bg-green-500/20 border border-green-500/30"
                                : "bg-blue-500/20 border border-blue-500/30"
                              }`}>
                {step.done ? "✓" : (
                  <span className="w-3 h-3 border-2 border-blue-400/50 
                                   border-t-blue-400 rounded-full animate-spin" />
                )}
              </div>

              {/* Text */}
              <span className="text-sm" style={{
  color: step.done ? "var(--text-muted)" : "var(--text-primary)",
  textDecoration: step.done ? "line-through" : "none"
}}>
  {step.text}
</span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 w-full bg-white/5 rounded-full h-1">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "75%" }}
            transition={{ duration: 15, ease: "linear" }}
            className="h-1 rounded-full"
style={{ background: "var(--accent-gradient)" }}
          />
        </div>
      </div>
    </motion.div>
  );
}