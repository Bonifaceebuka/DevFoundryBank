enum EMAIL_TEMPLATES {
    email_verification_queue = 'email-verification',
}

export function getEmailTemplate(key: EMAIL_TEMPLATES): string {
    return "email-verification";
}