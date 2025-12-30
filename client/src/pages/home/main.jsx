import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const Main = () => {
  const { userData } = useAppStore();
  const isAuthorized = !!userData;

  return (
    <div
      className="relative min-h-screen w-full bg-linear-to-br
    from-emerald-900
    via-green-950
    to-zinc-950 text-white overflow-x-hidden"
    >
      <div className="relative z-10">
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <motion.img
            src="CubingLogoLight.png"
            alt="CubiX Logo"
            className="w-40 mb-6 opacity-90"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          />

          <motion.h1
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            CubiX — змагальна платформа для швидкубінгу
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg text-white/80"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            Кімнати для змагань, контести та жива конкуренція між куберами.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {isAuthorized ? (
              <Link
                to="/rooms"
                className="px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium"
              >
                Перейти до кімнат
              </Link>
            ) : (
              <Link
                to="/auth"
                className="px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 transition font-medium"
              >
                Приєднатись
              </Link>
            )}
          </motion.div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-32 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "🏁 Кімнати для змагань",
              text: "Створюй батли, запрошуй друзів або змагайся з випадковими суперниками в реальному часі.",
            },
            {
              title: "🏆 Контести",
              text: "Регулярні турніри з різними дисциплінами та загальними рейтингами.",
            },
            {
              title: "📊 Аналітика",
              text: "Детальна статистика, відстеження рейтингів та рекордів.",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="rounded-xl bg-zinc-900/70 border border-zinc-800 p-6"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-white/70">{item.text}</p>
            </motion.div>
          ))}
        </section>

        {!isAuthorized && (
          <section className="px-6 pb-32 text-center">
            <motion.h2
              className="text-3xl font-bold"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Почни змагатися вже сьогодні
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/auth"
                className="inline-block mt-8 px-8 py-3 rounded-lg
                         bg-emerald-600 hover:bg-emerald-500 transition font-medium"
              >
                Увійти або зареєструватися
              </Link>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Main;
