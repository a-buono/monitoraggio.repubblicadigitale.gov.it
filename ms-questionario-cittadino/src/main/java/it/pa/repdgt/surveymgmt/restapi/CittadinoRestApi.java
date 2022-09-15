package it.pa.repdgt.surveymgmt.restapi;

import java.io.ByteArrayInputStream;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.csv.CSVFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import it.pa.repdgt.shared.restapi.param.SceltaProfiloParam;
import it.pa.repdgt.surveymgmt.bean.SchedaCittadinoBean;
import it.pa.repdgt.surveymgmt.collection.QuestionarioCompilatoCollection;
import it.pa.repdgt.surveymgmt.dto.CittadinoDto;
import it.pa.repdgt.surveymgmt.dto.SedeDto;
import it.pa.repdgt.surveymgmt.param.CittadiniPaginatiParam;
import it.pa.repdgt.surveymgmt.projection.CittadinoProjection;
import it.pa.repdgt.surveymgmt.request.CittadinoRequest;
import it.pa.repdgt.surveymgmt.resource.CittadiniPaginatiResource;
import it.pa.repdgt.surveymgmt.service.CittadinoService;
import it.pa.repdgt.surveymgmt.service.QuestionarioCompilatoService;
import it.pa.repdgt.surveymgmt.util.CSVCittadiniUtil;

@RestController
@RequestMapping(path = "/cittadino")
public class CittadinoRestApi {
	@Autowired
	private CittadinoService cittadinoService;
	@Autowired
	private QuestionarioCompilatoService questionarioCompilatoService;
	
	/***
	 * Restituisce tutti i cittadini paginati 
	 * 
	 * */
	// TOUCH POINT - 7.1.1 - Lista cittadini paginata
	@PostMapping(path = "/all")
	@ResponseStatus(value = HttpStatus.OK)
	public CittadiniPaginatiResource getAllCittadini(
		@RequestParam(name = "currPage", defaultValue = "0")  Integer currPage,
		@RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize,
		@RequestBody @Valid final CittadiniPaginatiParam cittadiniPaginatiParam) {
		final List<CittadinoDto> cittadiniList = this.cittadinoService.getAllCittadiniPaginati(
				cittadiniPaginatiParam,
				currPage,
				pageSize
			);
		
		final Integer totaleElementi = this.cittadinoService.getNumeroTotaleCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
		final int numeroPagine = (int) (totaleElementi /pageSize);

		return new CittadiniPaginatiResource(
				cittadiniList, 
				totaleElementi % pageSize > 0 ? numeroPagine+1 : numeroPagine,
				Long.valueOf(totaleElementi)
			);
	}
	
	/***
	 * Restituisce le sedi per popolare il filtro dei cittadini 
	 * 
	 * */
	// TOUCH POINT - 7.1.2 - Lista sedi dropdown
	@PostMapping(path = "/sedi/dropdown")
	@ResponseStatus(value = HttpStatus.OK)
	public List<SedeDto> getAllSediDropdown(@RequestBody @Valid final CittadiniPaginatiParam cittadiniPaginatiParam) {
		return this.cittadinoService.getAllSediDropdown(cittadiniPaginatiParam);
	}
	
	/***
	 * Aggiorna i dati del cittadino
	 * 
	 * */
	@PutMapping(path = "/{id}")
	@ResponseStatus(value = HttpStatus.OK)
	public void aggiornaCittadino(
			@PathVariable(value = "id") Long id,
			@RequestBody @Valid final CittadinoRequest cittadinoRequest) {
		this.cittadinoService.aggiornaCittadino(id, cittadinoRequest);
	}
	
	
	/***
	 * Restituisce la scheda del cittadino 
	 * 
	 * */
	// TOUCH POINT - 7.2.1 - Scheda cittadino
	@PostMapping(path = "/{idCittadino}")
	@ResponseStatus(value = HttpStatus.OK)
	public SchedaCittadinoBean getSchedaCittadino(@PathVariable(value = "idCittadino") final Long idCittadino,
			@RequestBody @Valid final SceltaProfiloParam profilazioneParam) {
		return this.cittadinoService.getSchedaCittadinoById(idCittadino, profilazioneParam);
	}
	
	/**
	 * Recupero del questionario compilato
	 * 
	 * */
	@GetMapping(path = "/questionarioCompilato/{idQuestionario}")
	@ResponseStatus(value = HttpStatus.OK)
	public QuestionarioCompilatoCollection getQuestionarioCompilato(
			@PathVariable(value = "idQuestionario") String idQuestionario) {
		return this.questionarioCompilatoService.getQuestionarioCompilatoById(idQuestionario);
	}
	
	/**
	 *  TOUCH POINT 7.2.4 - Download lista cittadini
	 */
	@PostMapping(path = "/download")
	public ResponseEntity<InputStreamResource> downloadListaCSVCittadini(@RequestBody @Valid CittadiniPaginatiParam cittadiniPaginatiParam) {
		List<CittadinoProjection> cittadiniProjection = this.cittadinoService.getAllCittadiniFacilitatoreByFiltro(cittadiniPaginatiParam);
		ByteArrayInputStream byteArrayInputStream = CSVCittadiniUtil.exportCSVCittadini(cittadiniProjection, CSVFormat.DEFAULT);
		InputStreamResource fileCSV = new InputStreamResource(byteArrayInputStream);
		
		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=cittadini.csv")
				.contentType(MediaType.parseMediaType("application/csv"))
				.body(fileCSV);
	}
}