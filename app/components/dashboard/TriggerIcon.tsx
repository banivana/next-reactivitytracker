import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDog,
  faPerson,
  faPersonRunning,
  faCat,
  faChildReaching,
  faPersonBiking,
  faCar,
  faMotorcycle,
} from "@fortawesome/free-solid-svg-icons";

// List of all possible trigger types and their icons
export const TRIGGER_ICONS = {
  dog: { fa6: "dog" },
  stranger: { fa6: "person" },
  runner: { fa6: "person-running" },
  cat: { fa6: "cat" },
  child: { fa6: "child-reaching" },
  bike: { fa6: "person-biking" },
  car: { fa6: "car" },
  scooter: { mci: "scooter" },
  skateboarder: { mci: "skateboarding" },
  rollerblader: { mci: "rollerblade" },
  motorcycle: { fa6: "motorcycle" },
};

type TriggerIconProps = {
  triggerType: string;
  reactionLevel?: string;
  size?: number;
};

export const TriggerIcon = ({
  triggerType,
  reactionLevel,
  size = 24,
}: TriggerIconProps) => {
  // Get the icon config for this trigger type
  const triggerConfig = TRIGGER_ICONS[triggerType];

  // If no match is found, default to Dog
  if (!triggerConfig) {
    return (
      <FontAwesomeIcon
        icon={faDog}
        style={{ color: "#EF4444", fontSize: size }}
      />
    );
  }

  // Determine color based on reaction level
  const reactionColor = reactionLevel
    ? reactionLevel === "green"
      ? "#22C55E"
      : reactionLevel === "yellow"
      ? "#f8d600"
      : "#EF4444"
    : "#EF4444"; // Default to red

  // Map the FA6 icon or MCI icon to the corresponding FontAwesome icon
  if (triggerConfig.fa6) {
    switch (triggerConfig.fa6) {
      case "dog":
        return (
          <FontAwesomeIcon
            icon={faDog}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "person":
        return (
          <FontAwesomeIcon
            icon={faPerson}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "person-running":
        return (
          <FontAwesomeIcon
            icon={faPersonRunning}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "cat":
        return (
          <FontAwesomeIcon
            icon={faCat}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "child-reaching":
        return (
          <FontAwesomeIcon
            icon={faChildReaching}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "person-biking":
        return (
          <FontAwesomeIcon
            icon={faPersonBiking}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "car":
        return (
          <FontAwesomeIcon
            icon={faCar}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      case "motorcycle":
        return (
          <FontAwesomeIcon
            icon={faMotorcycle}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
      default:
        return (
          <FontAwesomeIcon
            icon={faDog}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
    }
  }

  // For MCI icons, we'll map to closest Font Awesome equivalent
  if (triggerConfig.mci) {
    switch (triggerConfig.mci) {
      case "scooter":
        return (
          <FontAwesomeIcon
            icon={faPersonBiking}
            style={{ color: reactionColor, fontSize: size }}
          />
        ); // Using bike as fallback
      case "skateboarding":
        return (
          <FontAwesomeIcon
            icon={faPerson}
            style={{ color: reactionColor, fontSize: size }}
          />
        ); // Using person as fallback
      case "rollerblade":
        return (
          <FontAwesomeIcon
            icon={faPersonRunning}
            style={{ color: reactionColor, fontSize: size }}
          />
        ); // Using running as fallback
      default:
        return (
          <FontAwesomeIcon
            icon={faDog}
            style={{ color: reactionColor, fontSize: size }}
          />
        );
    }
  }

  // Default fallback
  return (
    <FontAwesomeIcon
      icon={faDog}
      style={{ color: reactionColor, fontSize: size }}
    />
  );
};
