<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:template match="/">
		<div class="container">
			<div>
				<a href="../../../../codelists/codelists.xml">
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Lataa koodistot XML-muodossa</xsl:when>
						<xsl:when test="$language='sv'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Ladda ner kodlistorna i XML-format</xsl:when>
						<xsl:when test="$language='en'">
							<span class="icon icon-tulli-external" style="margin-right:3px"/>Download codelists in XML format</xsl:when>
					</xsl:choose>
				</a>
				<p/>
			</div>
			<div class="row">
				<div class="col-md-3 col-sm-3 sidebar" role="complementary">
					<nav id="nav-sidebar" class="hidden-print collapse navbar-collapse" data-spy="affix" data-offset-top="210">
						<ul class="nav nav-stacked">
							<xsl:for-each select="CodeLists/CodeList">
								<li>
									<xsl:if test="position()=1">
										<xsl:attribute name="class">active</xsl:attribute>
									</xsl:if>
									<a>
										<xsl:attribute name="href">
											<xsl:value-of select="concat('#CODELIST_',Identification)"/>
										</xsl:attribute>
										<xsl:value-of select="Name[@lang=($language)]"/>
									</a>
								</li>
							</xsl:for-each>
						</ul>
					</nav>
				</div>
				<div class="col-md-9 col-sm-9 col-xs-12" role="main">
					<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
						<xsl:for-each select="CodeLists/CodeList">
							<div class="panel panel-primary">
								<div class="panel-heading" role="tab" id="heading-colors">
									<h2 class="panel-title">
										<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true">
											<xsl:attribute name="id">
												<xsl:value-of select="concat('CODELIST_',Identification)"/>
											</xsl:attribute>
											<xsl:attribute name="aria-controls">
												<xsl:value-of select="concat('CODELIST_',Identification)"/>
											</xsl:attribute>
											<xsl:choose>
												<xsl:when test="$language='fi'">
													<xsl:value-of select="concat('KOODISTO ',Identification)"/> - <xsl:value-of select="Name[@lang=($language)]"/>
												</xsl:when>
												<xsl:when test="$language='sv'">
													<xsl:value-of select="concat('KODFÖRTECKNING ',Identification)"/> - <xsl:value-of select="Name[@lang=($language)]"/>
												</xsl:when>
												<xsl:when test="$language='en'">
													<xsl:value-of select="concat('CODELIST ',Identification)"/> - <xsl:value-of select="Name[@lang=($language)]"/>
												</xsl:when>
											</xsl:choose>
										</a>
									</h2>
								</div>
							</div>
							<div class="panel-collapse collapse in" role="tabpanel">
								<xsl:attribute name="id">
									<xsl:value-of select="concat('CODELIST_',Identification)"/>
								</xsl:attribute>
								<xsl:attribute name="aria-labelledby">
									<xsl:value-of select="concat('heading_CODELIST_',Identification)"/>
								</xsl:attribute>
								<xsl:value-of select="Description[@lang=($language)]"/>
								<table class="table table-striped table-hover table-responsive">
									<thead>
										<tr>
											<xsl:choose>
												<xsl:when test="$language='fi'">
													<th>Koodi</th>
													<th>Nimi</th>
													<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
														<th>Selite</th>
													</xsl:if>
													<th>Voimassaolo</th>
												</xsl:when>
												<xsl:when test="$language='sv'">
													<th>Kod</th>
													<th>Namn</th>
													<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
														<th>Beskrivning</th>
													</xsl:if>
													<th>Giltighet</th>
												</xsl:when>
												<xsl:when test="$language='en'">
													<th>Code</th>
													<th>Name</th>
													<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
														<th>Description</th>
													</xsl:if>
													<th>Validity</th>
												</xsl:when>
											</xsl:choose>
										</tr>
									</thead>
									<xsl:for-each select="CodeItem">
										<xsl:variable name="start" select="concat(substring(StartDate,1,4), substring(StartDate,6,2), substring(StartDate,9,2))"/>
										<xsl:variable name="end" select="concat(substring(EndDate,1,4), substring(EndDate,6,2), substring(EndDate,9,2))"/>
										<xsl:if test="$messageType >= $start and $end >= $messageType">
											<tr>
												<td>
													<xsl:choose>
														<xsl:when test="Header=1">
															<b>
																<xsl:value-of select="Code"/>
															</b>
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="Code"/>
														</xsl:otherwise>
													</xsl:choose>
												</td>
												<td>
													<xsl:choose>
														<xsl:when test="Header=1">
															<b>
																<xsl:value-of select="Name[@lang=($language)]"/>
															</b>
														</xsl:when>
														<xsl:otherwise>
															<xsl:value-of select="Name[@lang=($language)]"/>
														</xsl:otherwise>
													</xsl:choose>
												</td>
												<xsl:if test="count(../CodeItem/Description[@lang=($language)][string(.)]) > 0">
													<td>
														<xsl:choose>
															<xsl:when test="Header=1">
																<b>
																	<xsl:value-of select="Description[@lang=($language)]"/>
																</b>
															</xsl:when>
															<xsl:otherwise>
																<xsl:choose>
																	<xsl:when test="contains(Description[@lang=($language)], 'http')">
																		<xsl:value-of select="substring-before(Description[@lang=($language)], 'http')"/>
																		<a target="_blank">
																			<xsl:attribute name="href">
																				<xsl:value-of select="concat('http', substring-before(substring-after(Description[@lang=($language)], 'http'), ' '))"/>
																			</xsl:attribute>
																			<xsl:value-of select="concat('http', substring-before(substring-after(Description[@lang=($language)], 'http'), ' '))"/>
																		</a>
																		<xsl:value-of select="concat(' ',substring-after(substring-after(Description[@lang=($language)], 'http'), ' '))"/>
																	</xsl:when>
																	<xsl:otherwise>
																		<xsl:value-of select="Description[@lang=($language)]"/>
																	</xsl:otherwise>
																</xsl:choose>
															</xsl:otherwise>
														</xsl:choose>
													</td>
												</xsl:if>
												<xsl:choose>
													<xsl:when test="$language='fi'">
														<td>
															<xsl:value-of select="format-number(substring(StartDate,9,2), '#')"/>.<xsl:value-of select="format-number(substring(StartDate,6,2), '#')"/>.<xsl:value-of select="substring(StartDate,1,4)"/> - <xsl:value-of select="format-number(substring(EndDate,9,2), '#')"/>.<xsl:value-of select="format-number(substring(EndDate,6,2), '#')"/>.<xsl:value-of select="substring(EndDate,1,4)"/>
														</td>
													</xsl:when>
													<xsl:when test="$language='sv'">
														<td>
															<xsl:value-of select="substring(StartDate,1,4)"/>-<xsl:value-of select="substring(StartDate,6,2)"/>-<xsl:value-of select="substring(StartDate,9,2)"/> - <xsl:value-of select="substring(EndDate,1,4)"/>-<xsl:value-of select="substring(EndDate,6,2)"/>-<xsl:value-of select="substring(EndDate,9,2)"/>
														</td>
													</xsl:when>
													<xsl:when test="$language='en'">
														<td>
															<xsl:value-of select="substring(StartDate,9,2)"/>/<xsl:value-of select="substring(StartDate,6,2)"/>/<xsl:value-of select="substring(StartDate,1,4)"/> - <xsl:value-of select="substring(EndDate,9,2)"/>/<xsl:value-of select="substring(EndDate,6,2)"/>/<xsl:value-of select="substring(EndDate,1,4)"/>
														</td>
													</xsl:when>
												</xsl:choose>
											</tr>
										</xsl:if>
									</xsl:for-each>
								</table>
							</div>
						</xsl:for-each>
					</div>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>