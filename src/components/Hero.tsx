export default function Hero() {
  return (
    <div className="relative pt-14 pb-8 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px]">
      {/* Avatar */}
      <div className="relative mb-4">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-slate-400/30 shadow-xl shadow-black/30">
          <img
            src="/images/avatar.png"
            alt="鹤川"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-800"></div>
      </div>

      {/* Name */}
      <h1 className="brand-gradient text-4xl sm:text-5xl mb-3 tracking-wider">
        鹤川
      </h1>

      {/* Tagline */}
      <p className="text-slate-300/80 text-sm sm:text-base max-w-lg text-center px-4">
        「 愿你我都能在代码与文字中，找到属于自己的星辰大海 」
      </p>
    </div>
  );
}
