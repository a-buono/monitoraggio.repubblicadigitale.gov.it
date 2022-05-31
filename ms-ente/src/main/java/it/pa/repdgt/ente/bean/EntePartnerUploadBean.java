package it.pa.repdgt.ente.bean;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class EntePartnerUploadBean {
	private String nome;
	private String nomeBreve;
	private String piva;
	private String sedeLegale;
	private String esito;
	
	public EntePartnerUploadBean(String nome, String nomeBreve, String piva, String sedeLegale) {
		this.nome = nome;
		this.nomeBreve = nomeBreve;
		this.piva = piva;
		this.sedeLegale = sedeLegale;
	}
}
