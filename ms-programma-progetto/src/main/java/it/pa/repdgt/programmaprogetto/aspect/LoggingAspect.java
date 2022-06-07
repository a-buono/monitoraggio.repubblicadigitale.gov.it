package it.pa.repdgt.programmaprogetto.aspect;

import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;

@Component
@Aspect
@Slf4j
public class LoggingAspect {
	
	/**
	 * Pointcut that matches all Spring beans in the application's main packages.
	 */
	@Pointcut("within(it.pa.repdgt.programmaprogetto..*)" + 
			  " || within(it.pa.repdgt.programmaprogetto.service..*)"
			+ " || within(it.pa.repdgt.programmaprogetto.restapi..*)")
	public void myApplicationPackagePointcut() {
		// Method is empty as this is just a Pointcut, the implementations are in the
		// advices.
	}

	/**
	 * Pointcut that matches all repositories, services and Web REST endpoints.
	 */
	@Pointcut("within(@org.springframework.stereotype.Repository *)"
			+ " || within(@org.springframework.stereotype.Service *)"
			+ " || within(@org.springframework.stereotype.Component *)"
			+ " || within(@org.springframework.web.bind.annotation.RestController *)")
	public void springBeanPointcut() {
		// Method is empty as this is just a Pointcut, the implementations are in the
		// advices.
	}

	/**
	 * Advice that logs when a method is entered and exited.
	 *
	 * @param joinPoint join point for advice
	 * @return result
	 * @throws Throwable throws IllegalArgumentException
	 */
	@Around("myApplicationPackagePointcut() && springBeanPointcut()")
	public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
		Signature methodSignature = joinPoint.getSignature();
		final String className  = methodSignature.getDeclaringTypeName();
		final String methodName = methodSignature.getName();
		final String methodArgs = Arrays.toString(joinPoint.getArgs());
		
		if (log.isDebugEnabled()) {
			log.info("START: {}.{}() with argument[s] = {}", className, methodName, methodArgs);
		}
		try {
			Object result = joinPoint.proceed();
			if (log.isDebugEnabled()) {
				log.debug("END: {}.{}() with result = {}", className, methodName, result);
			}
			return result;
		} catch (IllegalArgumentException ex) {
			log.error("Illegal argument: {} in {}.{}()", methodArgs, className, methodName);
			throw ex;
		}
	}

	
	@Around("@annotation(it.pa.repdgt.shared.annotation.LogMethod)")
	public Object logMethod(ProceedingJoinPoint joinPoint) throws Throwable {
		final Object proced = joinPoint.proceed();
		if (log.isDebugEnabled()) {
			return proced;
		}
		
		final String args = Arrays.toString(joinPoint.getArgs());
		final Signature methodSignature = joinPoint.getSignature();
		final String className  = methodSignature.getDeclaringTypeName();
		final String methodName = methodSignature.getName();

		String logEnterMethod = new String( String.format("START - method: %s.%s()  with argument[s] = %s", className, methodName, args) );
		log.info("{}", logEnterMethod);
		return proced;
	}

	@Around("@annotation(it.pa.repdgt.shared.annotation.LogExecutionTime)")
	public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
		final Signature methodSignature = joinPoint.getSignature();
		final String className  = methodSignature.getDeclaringTypeName();
		final String methodName = methodSignature.getName();

		final StopWatch stopWatch = new StopWatch();
		stopWatch.start();
		Object result = joinPoint.proceed();
		stopWatch.stop();

		String classAndMethodName = String.format("method: %s.%s", className, methodName);
		log.info("TIMING - {} executed in {} ms", classAndMethodName, stopWatch.getTotalTimeMillis());
		return result;
	}
}