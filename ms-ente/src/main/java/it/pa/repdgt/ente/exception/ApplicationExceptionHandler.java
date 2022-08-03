package it.pa.repdgt.ente.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import it.pa.repdgt.shared.exception.CodiceErroreEnum;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class ApplicationExceptionHandler {

	// Gestione errore per annotation @Valid
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = MethodArgumentNotValidException.class)
	public Map<String, String> handleInvalidArgument(MethodArgumentNotValidException exc) {
		log.error("{}", exc);
		Map<String, String> erroriValidazione = new HashMap<>();
		BindingResult bindingRsult = exc.getBindingResult();
		List<FieldError> listFieldError = bindingRsult.getFieldErrors();
		listFieldError.forEach(fieldError -> {
			erroriValidazione.put(fieldError.getField(), fieldError.getDefaultMessage());
		});
		erroriValidazione.put("errorCode", CodiceErroreEnum.G02.toString());
		return erroriValidazione;
	}
	
	// Gestione errore per annotation @Validated
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = ConstraintViolationException.class)
	public List<String> constraintViolationException(ConstraintViolationException exc) throws IOException {
		log.error("{}", exc);
		return exc.getConstraintViolations()
						.stream()
						.map(ConstraintViolation::getMessage)
						.collect(Collectors.toList());
	}
	
	@ResponseStatus(value = HttpStatus.NOT_FOUND)
	@ExceptionHandler(value = ResourceNotFoundException.class)
	public Map<String, String> handleResourceNotFound(ResourceNotFoundException exc) {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		errori.put("errorCode", exc.getCodiceErroreEnum().toString());
		return errori;
	}
	
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ExceptionHandler(value = HttpMessageNotReadableException.class)
	public Map<String, String> handleException(HttpMessageNotReadableException exc) {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("message", "Manca il corpo della richiesta oppure il json della richiesta non è valido");
		errori.put("errorCode", CodiceErroreEnum.G02.toString());
		return errori;
	}
	
	@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
	@ExceptionHandler(value = { EnteException.class, SedeException.class, EnteSedeProgettoException.class,
							    EnteSedeProgettoFacilitatoreException.class, RuoloException.class, Exception.class })
	public Map<String, String> handleException(Exception exc) {
		log.error("{}", exc);
		Map<String, String> errori = new HashMap<>();
		errori.put("message", exc.getMessage());
		EnteException enteException;
		SedeException sedeException;
		EnteSedeProgettoException enteSedeProgettoException;
		EnteSedeProgettoFacilitatoreException enteSedeProgettoFacilitatoreException;
		RuoloException ruoloException;
		if(exc instanceof EnteException) {
			enteException = (EnteException) exc;
			errori.put("errorCode", enteException.getCodiceErroreEnum().toString());
		} else if(exc instanceof SedeException) {
			sedeException = (SedeException) exc;
			errori.put("errorCode", sedeException.getCodiceErroreEnum().toString());
		} else if(exc instanceof EnteSedeProgettoException) {
			enteSedeProgettoException = (EnteSedeProgettoException) exc;
			errori.put("errorCode", enteSedeProgettoException.getCodiceErroreEnum().toString());
		} else if(exc instanceof RuoloException) {
			enteSedeProgettoFacilitatoreException = (EnteSedeProgettoFacilitatoreException) exc;
			errori.put("errorCode", enteSedeProgettoFacilitatoreException.getCodiceErroreEnum().toString());
		} else if(exc instanceof RuoloException){
			ruoloException = (RuoloException) exc;
			errori.put("errorCode", ruoloException.getCodiceErroreEnum().toString());
		} else {
			errori.put("errorCode", CodiceErroreEnum.G01.toString());
		}
		return errori;
	}
}