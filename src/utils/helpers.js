export const DEFAULT_AVATAR = "https://i.ibb.co/XZVfxWbx/main-Logo.webp";

export const formatDate = (dateString) => {
  if (!dateString) return "Data desconhecida";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export const formatHistoryDate = (dateString) => {
  if (!dateString) return "Data desconhecida";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const parseDamage = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  return parseInt(val.toString().replace(/\./g, "")) || 0;
};

export const isValidImage = (url) => {
  if (!url || typeof url !== "string") return false;
  return url.length > 10 && (url.startsWith("http") || url.startsWith("https"));
};

export const getSafeImage = (url) => {
  return isValidImage(url) ? url : DEFAULT_AVATAR;
};

export const getSessionWeight = (dungeonData) => {
  // Prioritize the dgs_count from the dungeon data object
  if (dungeonData && typeof dungeonData.dgs_count === 'number') {
    return dungeonData.dgs_count;
  }
  
  // Fallback to the original logic if dgs_count is not available
  const players = dungeonData?.players;
  if (!players || players.length === 0) return 1;
  const tanks = players.filter((p) => {
    const r = (p.role || "").toLowerCase().replace(/\s/g, "");
    return r === "maintank";
  });
  if (tanks.length > 0) {
    const totalPoints = tanks.reduce(
      (sum, tank) => sum + (Number(tank.points) || 0),
      0
    );
    return totalPoints > 0 ? totalPoints : 1;
  }
  return 1;
};

export const formatPlayerName = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

export const getRoleIcon = (roleName) => {
  const ROLE_ICONS = {
    golem: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_KEEPER@4",
    elevado: "https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF@4",
    "arcano elevado":
      "https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF@4",
    silence: "https://render.albiononline.com/v1/item/T8_MAIN_ARCANESTAFF@4",
    "arcano silence":
      "https://render.albiononline.com/v1/item/T8_MAIN_ARCANESTAFF@4",
    "main healer":
      "https://render.albiononline.com/v1/item/T8_MAIN_HOLYSTAFF_AVALON@4",
    "raiz ferrea":
      "https://render.albiononline.com/v1/item/T8_MAIN_NATURESTAFF_AVALON@4",
    "raiz férrea":
      "https://render.albiononline.com/v1/item/T8_MAIN_NATURESTAFF_AVALON@4",
    bruxo: "https://render.albiononline.com/v1/item/T8_2H_CURSEDSTAFF_MORGANA@4",
    incubus: "https://render.albiononline.com/v1/item/T8_MAIN_MACE_HELL@4",
    "quebra reino": "https://render.albiononline.com/v1/item/T8_2H_AXE_AVALON@4",
    "quebra-reino": "https://render.albiononline.com/v1/item/T8_2H_AXE_AVALON@4",
    oculto: "https://render.albiononline.com/v1/item/T8_2H_ARCANESTAFF_HELL@4",
    "foice de cristal":
      "https://render.albiononline.com/v1/item/T8_2H_SCYTHE_CRYSTAL@4",
    "raiz dps":
      "https://render.albiononline.com/v1/item/T8_ARMOR_LEATHER_UNDEAD@4",
    xbow: "https://render.albiononline.com/v1/item/T8_2H_REPEATINGCROSSBOW_UNDEAD@4",
    aguia: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_AVALON@4",
    águia: "https://render.albiononline.com/v1/item/T8_2H_SHAPESHIFTER_AVALON@4",
    fire: "https://render.albiononline.com/v1/item/T8_2H_INFERNOSTAFF_MORGANA@4",
    "bruxo dps":
      "https://render.albiononline.com/v1/item/T8_MAIN_CURSEDSTAFF_AVALON@4",
    frost: "https://render.albiononline.com/v1/item/T8_MAIN_FROSTSTAFF_AVALON@4",
    "main tank": "https://render.albiononline.com/v1/item/T8_MAIN_HAMMER@4",
    maintank: "https://render.albiononline.com/v1/item/T8_MAIN_HAMMER@4",
    zelador: "https://i.ibb.co/kgYdV1zS/Zelador.webp",
  };

  if (!roleName) return null;
  const normalized = String(roleName).toLowerCase().trim();
  if (ROLE_ICONS[normalized]) return ROLE_ICONS[normalized];
  return null;
};

export const getRoleGradient = (role) => {
  if (!role) return null;
  const r = role.toLowerCase().trim();

  if (r.includes("diretor"))
    return "linear-gradient(to right, #ec4899, #67e8f9, #ec4899)";
  if (r === "coordenador")
    return "linear-gradient(to right, #ef4444, #fca5a5, #ef4444)";
  if (r === "coordenadora")
    return "linear-gradient(to right, #ec4899, #fbcfe8, #ec4899)";
  if (r.includes("conselho"))
    return "linear-gradient(to right, #facc15, #fef08a, #facc15)";
  if (r.includes("8.4"))
    return "linear-gradient(to right, #fb923c, #facc15, #fb923c)";
  if (r.includes("8.3"))
    return "linear-gradient(to right, #a855f7, #d8b4fe, #a855f7)";
  if (r.includes("8.2"))
    return "linear-gradient(to right, #2563eb, #60a5fa, #2563eb)";
  if (r.includes("8.1"))
    return "linear-gradient(to right, #1e40af, #3b82f6, #1e40af)";
  if (r.includes("monitor"))
    return "linear-gradient(to right, #5b21b6, #a855f7, #5b21b6)";
  if (r === "aluno")
    return "linear-gradient(to right, #3b82f6, #60a5fa, #3b82f6)";
  if (r === "calouro")
    return "linear-gradient(to right, #60a5fa, #dbeafe, #60a5fa)";

  return null;
};

export const formatDGDate = (dateString) => {
  if (!dateString) return "Data desconhecida";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatDGTime = (totalSeconds) => {
  if (!totalSeconds || totalSeconds === 0) return "0s";
  
  const totalRounded = Math.round(totalSeconds);
  const hours = Math.floor(totalRounded / 3600);
  const minutes = Math.floor((totalRounded % 3600) / 60);
  const seconds = totalRounded % 60;
  
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  
  return parts.join(" ");
};

export const formatDGDateTime = (dateString) => {
  if (!dateString) return "Data desconhecida";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
