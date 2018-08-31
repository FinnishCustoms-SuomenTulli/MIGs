<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:variable name="language">en</xsl:variable>
	<xsl:template match="/">
		<div class="panel panel-primary">
			<div class="panel-heading" role="tab" id="heading-colors">
				<h2 class="panel-title">
					<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true">
						<xsl:attribute name="aria-controls"><xsl:value-of select="Message/Type"/></xsl:attribute>
						<span class="icon icon-tulli-message icon-white" style="margin-right:3px"/>
						<xsl:value-of select="Message/Type"/> - <xsl:value-of select="Message/Name[@lang=($language)]"/>
					</a>
				</h2>
			</div>
		</div>
		<xsl:if test="Message/Rule!=''">
			<p>
				<b>Rules:</b>
				<xsl:for-each select="Message/Rule">
					<a href="#" data-toggle="modal">
						<xsl:attribute name="data-target"><xsl:value-of select="concat('#RC_',.)"/></xsl:attribute>
						<xsl:value-of select="."/>
					</a>
					<xsl:if test="position() != last()">, </xsl:if>
				</xsl:for-each>
			</p>
		</xsl:if>
		<xsl:choose>
			<xsl:when test="$language='fi'">
				<h3>Tietoryhmien rakenne</h3>
			</xsl:when>
			<xsl:when test="$language='sv'">
				<h3>Datagruppernas struktur</h3>
			</xsl:when>
			<xsl:when test="$language='en'">
				<h3>Structure of groups</h3>
			</xsl:when>
		</xsl:choose>
		<table class="table table-responsive">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tietoryhmän nimi">
									<span class="icon icon-tulli-help"/>Tietoryhmä</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Tiedon pakollisuus&lt;br /&gt;R = pakollinen&lt;br /&gt;D = ehdollinen&lt;br /&gt;O = vapaaehtoinen">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tietoryhmän toistojen suurin sallittu määrä. Jos tietoryhmä on pakollinen, sen tulee esiintyä vähintään kerran.">
									<span class="icon icon-tulli-help"/>Kardinaliteetti</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tietoryhmää vastaava XML-polku sanoman skeemassa">
									<span class="icon icon-tulli-help"/>Polku</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Sovelletut säännöt ja ehdot">
									<span class="icon icon-tulli-help"/>Säännöt ja ehdot</a>
							</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Datagruppens namn">
									<span class="icon icon-tulli-help"/>Datagrupp</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Datas valfrihet&lt;br /&gt;R = obligatorisk&lt;br /&gt;D = villkorlig&lt;br /&gt;O = frivillig">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Det maximala antalet gånger som en datagrupp kan upprepas. Om en datagrupp är obligatorisk måste den upprepas minst en gång.">
									<span class="icon icon-tulli-help"/>Kardinalitet</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Den motsvarande XML-sökvägen i meddelandeskeman">
									<span class="icon icon-tulli-help"/>Sökväg</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tillämpade regler och villkor">
									<span class="icon icon-tulli-help"/>Regler och villkor</a>
							</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Name of the data group">
									<span class="icon icon-tulli-help"/>Data group</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Optionality of the data&lt;br /&gt;R = required&lt;br /&gt;D = dependant (on a condition)&lt;br /&gt;O = optional">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="The maximum number of times a data group can be repeated. If a data group is mandatory, it must be repeated at least once.">
									<span class="icon icon-tulli-help"/>Cardinality</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="The corresponding XML path in the message schema">
									<span class="icon icon-tulli-help"/>Path</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Applied rules and conditions">
									<span class="icon icon-tulli-help"/>Rules and conditions</a>
							</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<tbody>
				<xsl:for-each select="descendant::DataGroup">
					<tr>
						<xsl:variable name="class">
							<xsl:choose>
								<xsl:when test="position() mod 2 = 1">odd </xsl:when>
							</xsl:choose>
						</xsl:variable>
						<xsl:attribute name="class"><xsl:value-of select="concat($class,'indent-',count(ancestor::*)-1)"/></xsl:attribute>
						<td>
							<a>
								<xsl:attribute name="id"><xsl:value-of select="translate(concat('Group_',//Type,'_',../XPath,'_',Name[@lang=($language)]),' ','')"/></xsl:attribute>
								<xsl:attribute name="href"><xsl:value-of select="translate(concat('#Element_',//Type,'_',../XPath,'_',Name[@lang=($language)]),' ','')"/></xsl:attribute>
								<span class="icon icon-tulli-treeview" style="margin-right:0.2em"/>
								<xsl:value-of select="Name[@lang=($language)]"/>
							</a>
						</td>
						<td>
							<xsl:choose>
								<xsl:when test="Condition != ''">D</xsl:when>
								<xsl:when test="MinOccurence=0">O</xsl:when>
								<xsl:otherwise>R</xsl:otherwise>
							</xsl:choose>
						</td>
						<td>
							<xsl:value-of select="MaxOccurence"/>x
            </td>
						<td>
							<xsl:for-each select="ancestor-or-self::*">
								<xsl:value-of select="XPath"/>
								<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
							</xsl:for-each>
						</td>
						<td>
							<xsl:for-each select="Rule | Condition">
								<a href="#" data-toggle="modal">
									<xsl:attribute name="data-target"><xsl:value-of select="concat('#RC_',.)"/></xsl:attribute>
									<xsl:value-of select="."/>
								</a>
								<xsl:if test="position() != last()">, </xsl:if>
							</xsl:for-each>
						</td>
					</tr>
					<xsl:if test="DescriptionLine[@lang=($language)]!=''">
						<tr>
							<xsl:attribute name="class"><xsl:value-of select="concat('description indent-',count(ancestor::*)-1)"/></xsl:attribute>
							<td colspan="5">
								<span class="icon icon-tulli-info" style="margin-right:3px"/>
								<xsl:for-each select="DescriptionLine[@lang=($language)]">
									<xsl:value-of select="."/>
									<xsl:if test="position() != last()">
										<br/>
									</xsl:if>
								</xsl:for-each>
							</td>
						</tr>
					</xsl:if>
				</xsl:for-each>
			</tbody>
		</table>
		<xsl:choose>
			<xsl:when test="$language='fi'">
				<h3>Tietoelementtien rakenne</h3>
			</xsl:when>
			<xsl:when test="$language='sv'">
				<h3>Dataelementens struktur</h3>
			</xsl:when>
			<xsl:when test="$language='en'">
				<h3>Structure of elements</h3>
			</xsl:when>
		</xsl:choose>
		<table class="table table-responsive">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tietoelementin nimi">
									<span class="icon icon-tulli-help"/>Tietoelementti</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Tiedon pakollisuus&lt;br /&gt;R = pakollinen&lt;br /&gt;D = ehdollinen&lt;br /&gt;O = vapaaehtoinen">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Tiedon muoto&lt;br /&gt;a = aakkosellinen&lt;br /&gt;n = numeerinen&lt;br /&gt;an = aakkosnumeerinen&lt;br /&gt;Numero kertoo kentän pituuden. Jos sitä edeltää kaksi pistettä, on kenttä muuttuvan mittainen. Pilkun jälkeinen numero kertoo desimaalien enimmäismäärän.">
									<span class="icon icon-tulli-help"/>Muoto</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tietoelementtiä vastaava XML-polku sanoman skeemassa">
									<span class="icon icon-tulli-help"/>Polku</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Soveltuvat koodistot">
									<span class="icon icon-tulli-help"/>Koodisto</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Sovelletut säännöt ja ehdot">
									<span class="icon icon-tulli-help"/>Säännöt ja ehdot</a>
							</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Dataelementets namn">
									<span class="icon icon-tulli-help"/>Dataelement</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Datas valfrihet&lt;br /&gt;R = obligatorisk&lt;br /&gt;D = villkorlig&lt;br /&gt;O = frivillig">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Datas format&lt;br /&gt;a = alfabetiskt&lt;br /&gt;n = numerisk&lt;br /&gt;an = alfanumerisk&lt;br /&gt;Talet anger fältets längd. Om det föregås av två punkter, är längden varierande. Et tal efter ett komma anger maximala antalet decimaler.">
									<span class="icon icon-tulli-help"/>Datas format</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Den motsvarande XML-sökvägen i meddelandeskeman">
									<span class="icon icon-tulli-help"/>Sökväg</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tillämpade kodförteckningar">
									<span class="icon icon-tulli-help"/>Kodförteckning</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Tillämpade regler och villkor">
									<span class="icon icon-tulli-help"/>Regler och villkor</a>
							</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Name of the data element">
									<span class="icon icon-tulli-help"/>Data element</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Optionality of the data&lt;br /&gt;R = required&lt;br /&gt;D = dependant (on a condition)&lt;br /&gt;O = optional">
									<span class="icon icon-tulli-help"/>RDO</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-html="true" data-placement="top" title="Format of the data&lt;br /&gt;a = alphabetic&lt;br /&gt;n = numeric&lt;br /&gt;an = alphanumeric&lt;br /&gt;The number indicates the length of the field. If it is preceded by two dots, the length is variable. A number after a comma indicates the maximum number of decimals.">
									<span class="icon icon-tulli-help"/>Format</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="The corresponging XML path in the message schema">
									<span class="icon icon-tulli-help"/>Path</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="The XML type of the data">
									<span class="icon icon-tulli-help"/>General type</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Applicable code lists">
									<span class="icon icon-tulli-help"/>Codelist</a>
							</th>
							<th>
								<a class="thead-link" href="#" type="button" data-toggle="tooltip" data-placement="top" title="Applied rules and conditions">
									<span class="icon icon-tulli-help"/>Rules and conditions</a>
							</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="descendant::DataGroup | descendant::DataElement">
				<xsl:choose>
					<xsl:when test="local-name()='DataGroup'">
						<tr>
							<xsl:attribute name="class"><xsl:value-of select="concat('group indent-',count(ancestor::*)-1)"/></xsl:attribute>
							<td colspan="7">
								<a>
									<xsl:attribute name="id"><xsl:value-of select="translate(concat('Element_',//Type,'_',../XPath,'_',Name[@lang=($language)]),' ','')"/></xsl:attribute>
									<xsl:attribute name="href"><xsl:value-of select="translate(concat('#Group_',//Type,'_',../XPath,'_',Name[@lang=($language)]),' ','')"/></xsl:attribute>
									<span class="icon icon-tulli-treeview" style="margin-right:0.2em"/>
									<xsl:value-of select="Name[@lang=($language)]"/>
								</a>
							</td>
						</tr>
					</xsl:when>
					<xsl:otherwise>
						<tr>
							<xsl:variable name="class">
								<xsl:choose>
									<xsl:when test="(count(preceding-sibling::*) mod 2) = 0">odd </xsl:when>
								</xsl:choose>
							</xsl:variable>
							<xsl:choose>
								<xsl:when test="count(ancestor::*)>2">
									<xsl:attribute name="class"><xsl:value-of select="concat($class, 'indent-',count(ancestor::*)-1)"/></xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									<xsl:attribute name="class"><xsl:value-of select="concat($class, 'indent-2')"/></xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
							<td>
								<span class="icon icon-tulli-hamburger-menu" style="margin-left:0.7em; margin-right:0.6em; font-size: 50%; vertical-align: middle"/>
								<xsl:value-of select="Name[@lang=($language)]"/>
							</td>
							<td>
								<xsl:choose>
									<xsl:when test="Condition != ''">D</xsl:when>
									<xsl:when test="MinOccurence = 0">O</xsl:when>
									<xsl:otherwise>R</xsl:otherwise>
								</xsl:choose>
							</td>
							<td>
								<xsl:value-of select="Format"/>
							</td>
							<td>
								<xsl:for-each select="ancestor-or-self::*">
									<xsl:value-of select="XPath"/>
									<xsl:if test="position() != last() and position() != 1">/&#8203;</xsl:if>
								</xsl:for-each>
							</td>
							<td>
								<xsl:value-of select="GeneralType"/>
							</td>
							<td>
								<xsl:for-each select="Codelist">
									<a href="#" data-toggle="modal">
										<xsl:attribute name="data-target"><xsl:value-of select="concat('#CODELIST_',.)"/></xsl:attribute>
										<xsl:value-of select="."/>
									</a>
									<xsl:if test="position() != last()">, </xsl:if>
								</xsl:for-each>
							</td>
							<td>
								<xsl:for-each select="Rule | Condition">
									<a href="#" data-toggle="modal">
										<xsl:attribute name="data-target"><xsl:value-of select="concat('#RC_',.)"/></xsl:attribute>
										<xsl:value-of select="."/>
									</a>
									<xsl:if test="position() != last()">, </xsl:if>
								</xsl:for-each>
							</td>
						</tr>
						<xsl:if test="DescriptionLine[@lang=($language)]!=''">
							<tr>
								<xsl:choose>
									<xsl:when test="count(ancestor::*)>2">
										<xsl:attribute name="class"><xsl:value-of select="concat('description indent-',count(ancestor::*)-1)"/></xsl:attribute>
									</xsl:when>
									<xsl:otherwise>
										<xsl:attribute name="class"><xsl:value-of select="'description indent-2'"/></xsl:attribute>
									</xsl:otherwise>
								</xsl:choose>
								<td colspan="7">
									<span class="icon icon-tulli-info" style="margin-right:3px"/>
									<xsl:for-each select="DescriptionLine[@lang=($language)]">
										<xsl:value-of select="."/>
										<xsl:if test="position() != last()">
											<!--xsl:text disable-output-escaping="yes">&lt;br /&gt;</xsl:text-->
											<br/>
										</xsl:if>
									</xsl:for-each>
								</td>
							</tr>
						</xsl:if>
					</xsl:otherwise>
				</xsl:choose>
			</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
