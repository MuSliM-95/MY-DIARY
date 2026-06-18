export const LegalSection = () => {
	return (
	  <div className="space-y-4">
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
		  <h2 className="text-lg font-bold text-white">
			Условия использования
		  </h2>
  
		  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
			Atomic System предназначен для отслеживания привычек,
			ежедневной активности и личного прогресса.
		  </p>
		</div>
  
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
		  <h3 className="font-semibold text-white">
			Хранение данных
		  </h3>
  
		  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
			Все данные хранятся локально в браузере на вашем устройстве.
			На данный момент приложение не отправляет данные на сервер.
		  </p>
		</div>
  
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
		  <h3 className="font-semibold text-white">
			Конфиденциальность
		  </h3>
  
		  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
			Созданные привычки, статистика и настройки доступны только
			пользователю данного устройства.
		  </p>
		</div>
  
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
		  <h3 className="font-semibold text-white">
			Ответственность пользователя
		  </h3>
  
		  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
			Очистка браузера, удаление данных сайта или переустановка
			приложения могут привести к потере сохранённого прогресса.
		  </p>
		</div>
  
		<div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
		  <h3 className="font-semibold text-white">
			Изменение условий
		  </h3>
  
		  <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
			По мере развития Atomic System данные условия могут
			обновляться.
		  </p>
		</div>
	  </div>
	);
  };