package net.ruixin.util.exception;

public class RuleException extends RuntimeException {
	public RuleException() {
	}

	public RuleException(String message) {
		super(message);
	}

	public RuleException(String message, Throwable cause) {
		super(message, cause);
	}

	public RuleException(Throwable cause) {
		super(cause);
	}

	public RuleException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}
}

