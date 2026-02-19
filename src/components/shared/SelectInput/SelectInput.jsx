import { useTheme } from "@/contexts/ThemeContext";
import { Form } from "react-bootstrap";

const SelectInput = ({
    label,
    name,
    value,
    onChange,
    options,
    error,
    touched,
}) => {
    const theme = useTheme()
    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Select
                name={name}
                value={value}
                onChange={onChange}
                isInvalid={touched && error}
                style={{ backgroundColor: theme.background, border: theme.border, color: theme.textColor }}
            >
                <option value="">Select {label}</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        </Form.Group>
    );
};

export default SelectInput;
