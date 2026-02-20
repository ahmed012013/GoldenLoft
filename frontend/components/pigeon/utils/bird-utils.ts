import { TranslationKey } from "@/lib/translations";

export const getStatusColor = (status: string) => {
  const normalizedStatus = status?.toLowerCase().replace(/_/g, " ").trim();
  switch (normalizedStatus) {
    case "healthy":
      return "bg-green-500/10 text-green-500 border-green-500/30";
    case "sick":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    case "under observation":
    case "under monitoring":
    case "observation":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "deceased":
      return "bg-gray-500/10 text-gray-500 border-gray-500/30";
    case "sold":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30";
  }
};

export const getStatusText = (
  status: string,
  t: (key: TranslationKey) => string,
) => {
  const normalizedStatus = status?.toLowerCase().replace(/_/g, " ").trim();
  switch (normalizedStatus) {
    case "healthy":
      return t("healthy");
    case "sick":
      return t("sick");
    case "under observation":
    case "under monitoring":
    case "observation":
      return t("observation");
    case "deceased":
      return t("deceased");
    case "sold":
      return t("sold");
    default:
      return status;
  }
};

export const getRecordTypeColor = (type: string) => {
  switch (type) {
    case "vaccination":
      return "bg-blue-500/10 text-blue-500 border-blue-500/30";
    case "treatment":
      return "bg-amber-500/10 text-amber-500 border-amber-500/30";
    case "checkup":
      return "bg-green-500/10 text-green-500 border-green-500/30";
    case "illness":
      return "bg-red-500/10 text-red-500 border-red-500/30";
    default:
      return "bg-gray-500/10 text-gray-500 border-gray-500/30";
  }
};

export const getRecordTypeText = (
  type: string,
  t: (key: TranslationKey) => string,
) => {
  switch (type) {
    case "vaccination":
      return t("vaccination");
    case "treatment":
      return t("treatment");
    case "checkup":
      return t("checkup");
    case "illness":
      return t("illness");
    default:
      return type;
  }
};
