export type TournamentHonour = {
  year: number;
  format: "Doppio" | "Singolo";
  topFour: [string, string, string, string];
};

export const TOURNAMENT_HONOURS: TournamentHonour[] = [
  { year: 2026, format: "Doppio", topFour: ["Emanuele Ghianda & Teresa Cantamessa", "Marco Cantamessa & Marcello Sala", "Luigi Ghianda & Mary Gemme", "Stefano Giannelli & Katty Bussa"] },
  { year: 2026, format: "Singolo", topFour: ["Cesare Ghianda", "Emanuele Ghianda", "Marco Cantamessa", "Paolo Riva"] },
  { year: 2025, format: "Doppio", topFour: ["Stefano Giannelli & Simone Imberti", "Marco Cantamessa & Pierpaolo Scoccimarro", "Matteo Binda & Stefano Cracco", "Edoardo Capurro & Ilaria Bocelli"] },
  { year: 2025, format: "Singolo", topFour: ["Matteo Binda", "Ilaria Bocelli", "Luigi Ghianda", "Emanuele Ghianda"] },
  { year: 2024, format: "Doppio", topFour: ["Emanuele Ghianda & Luigi Ghianda", "Ilaria Bocelli & Luisa Cantamessa", "Cesare Ghianda & Katty Bussa", "Elena Poretta & Enzo Carena"] },
  { year: 2024, format: "Singolo", topFour: ["Cesare Ghianda", "Luigi Ghianda", "Alessio Accetta", "Katty Bussa"] },
  { year: 2023, format: "Doppio", topFour: ["Cesare Ghianda & Alessio Accetta", "Emanuele Ghianda & Cristina", "Matteo Binda & Luisa Cantamessa", "Andrea Binda & Stefano Cracco"] },
  { year: 2023, format: "Singolo", topFour: ["Luigi Ghianda", "Emanuele Ghianda", "Matteo Binda", "Cesare Ghianda"] },
  { year: 2022, format: "Doppio", topFour: ["Enzo Carena & Teresa Cantamessa", "Davide Gaggino & Piera Ciccarelli", "Cesare Ghianda & Enzo Grimaldi", "Luigi Ciccarelli & Francesco Novarini"] },
  { year: 2022, format: "Singolo", topFour: ["Matteo Binda", "Piera Ciccarelli", "Emanuele Ghianda", "Cesare Ghianda"] },
  { year: 2021, format: "Doppio", topFour: ["Cesare Ghianda & Matteo Binda", "Luigi Ciccarelli & De Battistis", "Luca Pulice & Susanna Grimaldi", "Walter Cantamessa & Piera Ciccarelli"] },
  { year: 2021, format: "Singolo", topFour: ["Marco Cantamessa", "Cesare Ghianda", "Barbara", "Davide Novarini"] },
  { year: 2020, format: "Doppio", topFour: ["Enzo Carena & Cristina", "Andrea Binda & Barbara", "Matteo Binda & Walter Cantamessa", "Luigi Ghianda & Piera Ciccarelli"] },
  { year: 2020, format: "Singolo", topFour: ["Enzo Carena", "Emanuele Ghianda", "Luigi Ghianda", "Ilaria Bocelli"] },
];
