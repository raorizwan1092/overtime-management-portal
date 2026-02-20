import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "react-bootstrap";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const CustomButton = ({
    label,
    type = "button",
    onClick,
    variant = "primary",
    disabled = false,
    className = "",
    fullWidth = false,
    loading = false,
}) => {
    const theme = useTheme();

    return (
        <Button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            variant={variant}
            className={`${className} ${fullWidth ? "w-100" : ""} d-flex align-items-center justify-content-center`}
            style={{
                backgroundColor: theme.btnBackground,
                border: theme.border,
                color: theme.btnText,
            }}
        >
            {loading ? (
                <AiOutlineLoading3Quarters
                    className="spin"
                    style={{ fontSize: "1.5rem", animation: "spin 1s linear infinite" }}
                />
            ) : (
                label
            )}

            <style jsx>{`
                .spin {
                    display: inline-block;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Button>
    );
};

export default CustomButton;
