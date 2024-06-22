import React, { useState, useEffect } from 'react';

interface TypingEffectProps {
    text: string;
    speed?: number;
}

const TypingEffect: React.FC<TypingEffectProps> = ({ text, speed = 75 }) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let index = 0;
        const interval = setInterval(() => {
            const char = text.charAt(index);
            setDisplayedText(prev => prev + (char === undefined ? "" : char));
            index++;
            if (index >= text.length) {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return <pre className='m-0' style={{whiteSpace: "pre-wrap"}}>{displayedText}</pre>;
};

export default TypingEffect;