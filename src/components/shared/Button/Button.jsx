import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "react-bootstrap";

const CustomButton = ({
    label,
    type = "button",
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    fullWidth = false,
}) => {
    const theme = useTheme();

    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled}
            variant={variant}
            className={`${className} ${fullWidth ? "w-100" : ""}`}
            style={{
                backgroundColor: theme.btnBackground,
                border: theme.border,
                color: theme.btnText,
            }}
        >
            {label}
        </Button>
    );
};

export default CustomButton;
