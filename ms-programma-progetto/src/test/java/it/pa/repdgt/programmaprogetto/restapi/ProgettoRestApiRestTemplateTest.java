package it.pa.repdgt.programmaprogetto.restapi;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.http.ResponseEntity;

import it.pa.repdgt.programmaprogetto.AppTests;
import it.pa.repdgt.programmaprogetto.bean.SchedaProgettoBean;
import it.pa.repdgt.programmaprogetto.request.ProgettiParam;
import it.pa.repdgt.programmaprogetto.request.ProgettoFiltroRequest;
import it.pa.repdgt.programmaprogetto.request.ProgettoRequest;
import it.pa.repdgt.programmaprogetto.resource.CreaProgettoResource;
import it.pa.repdgt.programmaprogetto.resource.ProgettiLightResourcePaginati;
import it.pa.repdgt.programmaprogetto.resource.ProgrammaDropdownResource;

@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class ProgettoRestApiRestTemplateTest extends AppTests{

	@Test
	void getAllProgettiPaginatiByRuolo() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtente("SMTPAL67R31F111X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		progParam.setIdProgramma(1L);
		
		ProgettiLightResourcePaginati response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/all", progParam, ProgettiLightResourcePaginati.class);
		assertThat(response.getListaProgettiLight().size()).isEqualTo(10);
	}
	
	@Test
	void getAllProgrammiDropdownPerProgettiTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtente("SMTPAL67R31F111X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/programmi/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(5);
	}
	
	@Test
	void getAllPoliciesDropdownByRuoloTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtente("SMTPAL67R31F111X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/policies/programmi/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	void getAllStatiDropdownByRuoloTest() {
		ProgettiParam progParam = new ProgettiParam();
		progParam.setCfUtente("SMTPAL67R31F111X");
		progParam.setCodiceRuolo("DTD");
		progParam.setFiltroRequest(new ProgettoFiltroRequest());
		
		@SuppressWarnings("unchecked")
		List<ProgrammaDropdownResource> response = restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto/stati/dropdown", progParam, ArrayList.class);
		assertThat(response.size()).isEqualTo(2);
	}
	
	@Test
	void getSchedaProgettoByIdTest() {
		ResponseEntity<SchedaProgettoBean> response = restTemplate.getForEntity("http://localhost:" + randomServerPort + "/progetto/{idProgetto}", SchedaProgettoBean.class, 252L);
		assertThat(response.getBody().getDettaglioProgetto().getNome()).isEqualTo("Progetto Sicurezza Informatica");
	}
	
	@Test
	void creaNuovoProgettoTest() {
		ProgettoRequest progettoRequest = new ProgettoRequest();
		progettoRequest.setNome("nuovoProgetto");
		progettoRequest.setNomeBreve("nomeBreve");
		progettoRequest.setDataInizio(new Date());
		progettoRequest.setDataFineProgetto(new Date());
		
		restTemplate.postForObject("http://localhost:" + randomServerPort + "/progetto?idProgramma=100", progettoRequest, CreaProgettoResource.class);
	}
	
	
}