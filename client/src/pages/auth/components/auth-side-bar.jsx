import React from "react";

const AuthSideBar = () => {
  return (
    <div
      className="relative w-full h-full rounded-l-lg overflow-hidden
                bg-linear-to-br from-green-600 via-emerald-600 to-green-800"
    >
      <div
        className="absolute inset-0 opacity-10
                  bg-[linear-gradient(rgba(255,255,255,0.15)_1px,transparent_1px),
                      linear-gradient(90deg,rgba(255,255,255,0.15)_1px,transparent_1px)]
                  bg-position-[32px_32px]"
      ></div>
      <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white">
        <div>
          <p className="text-2xl font-bold tracking-wide">CubiX</p>
          <p className="mt-2 text-sm text-white/80">
            Змагальна платформа з швидкубінгу
          </p>
        </div>

        <div className="space-y-3 flex flex-col justify-center items-center">
          <div>
            <img
              src="CubingLogoLight.png"
              alt="Logo"
              width="156px"
              className="opacity-90"
            />
          </div>

          <p className="text-sm text-white/80 max-w-xs text-center">
            Приєднуйся до нас, змагайся з друзями та приймай участь у контестах!
          </p>
        </div>

        <div className="text-xs text-white/60 text-right">© 2025 CubiX</div>
      </div>
    </div>
  );
};

export default AuthSideBar;
