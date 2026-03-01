"use client";

import { useTheme } from '@/contexts/ThemeContext'
import React, { useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const TextInput = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    error,
    touched,
    disabled = false
}) => {
    const theme = useTheme()
    const [showPassword, setShowPassword] = useState(false)

    const isPassword = type === "password"
    const inputType = isPassword ? (showPassword ? "text" : "password") : type

    return (
        <Form.Group className="mb-3 text-start">
            <Form.Label style={{ color: theme?.textColor }}>
                {label}
            </Form.Label>

            {isPassword ? (
                <InputGroup>
                    <Form.Control
                        name={name}
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        isInvalid={touched && error}
                        disabled={disabled}
                        style={{
                            backgroundColor: disabled ? '#232323' : theme.background,
                            border: theme.border,
                            color: theme.textColor
                        }}
                    />

                    <InputGroup.Text
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            cursor: "pointer",
                            backgroundColor: theme.background,
                            border: theme.border,
                            color: theme.textColor
                        }}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </InputGroup.Text>

                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </InputGroup>
            ) : (
                <>
                    <Form.Control
                        name={name}
                        type={type}
                        value={value}
                        onChange={onChange}
                        isInvalid={touched && error}
                        disabled={disabled}
                        style={{
                            backgroundColor: disabled ? '#232323' : theme.background,
                            border: theme.border,
                            color: theme.textColor
                        }}
                        as={type === "textarea" ? "textarea" : "input"}
                        rows={type === "textarea" ? 3 : undefined}
                    />

                    <Form.Control.Feedback type="invalid">
                        {error}
                    </Form.Control.Feedback>
                </>
            )}
        </Form.Group>
    )
}

export default TextInput
