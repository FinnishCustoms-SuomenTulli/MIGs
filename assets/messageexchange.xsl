<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="/">
		<div class="panel panel-primary">
			<div class="panel-heading" role="tab" id="heading-intro">
				<h2 class="panel-title">
					<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true" aria-controls="intro">
						<xsl:choose>
							<xsl:when test="$language='fi'">Yleistä</xsl:when>
							<xsl:when test="$language='sv'">Allmänt</xsl:when>
							<xsl:when test="$language='en'">General information</xsl:when>
						</xsl:choose>
					</a>
				</h2>
			</div>
			<div id="intro" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-intro">
				<div class="panel-body">
					<article>
						<div class="content-area">
							<xsl:for-each select="MessageExchange/Intro/TextLine[@lang=($language)] | MessageExchange/Intro/List">
								<xsl:choose>
									<xsl:when test="local-name()='List'">
										<ul>
											<xsl:for-each select="ListItem[@lang=($language)]">
												<li>
													<xsl:value-of select="."/>
												</li>
											</xsl:for-each>
										</ul>
									</xsl:when>
									<xsl:otherwise>
										<p>
											<xsl:value-of select="."/>
										</p>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:for-each>
						</div>
					</article>
				</div>
			</div>
		</div>
		<xsl:if test="MessageExchange/Glossary">
			<div class="panel panel-primary">
				<div class="panel-heading" role="tab" id="heading-glossary">
					<h2 class="panel-title">
						<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true" aria-controls="glossary">
							<xsl:choose>
								<xsl:when test="$language='fi'">Sanasto</xsl:when>
								<xsl:when test="$language='sv'">Ordlista</xsl:when>
								<xsl:when test="$language='en'">Glossary</xsl:when>
							</xsl:choose>
						</a>
					</h2>
				</div>
				<div id="glossary" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-glossary">
					<div class="panel-body">
						<article>
							<div class="content-area">
								<xsl:for-each select="MessageExchange/Glossary/GlossaryItem[@lang=($language)]">
									<b>
										<xsl:value-of select="Term"/>
									</b>
									<xsl:for-each select="Description">
										<p>
											<xsl:value-of select="."/>
										</p>
									</xsl:for-each>
								</xsl:for-each>
							</div>
						</article>
					</div>
				</div>
			</div>
		</xsl:if>
		<div class="panel panel-primary">
			<div class="panel-heading" role="tab" id="heading-messages">
				<h2 class="panel-title">
					<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true" aria-controls="messages">
						<xsl:choose>
							<xsl:when test="$language='fi'">Sanomat</xsl:when>
							<xsl:when test="$language='sv'">Meddelanden</xsl:when>
							<xsl:when test="$language='en'">Messages</xsl:when>
						</xsl:choose>
					</a>
				</h2>
			</div>
			<div id="messages" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-messages">
				<div class="panel-body">
					<article>
						<div class="content-area">
							<xsl:for-each select="MessageExchange/Messages/Message/Sender[not(preceding::Sender/. = .)]">
								<xsl:variable name="category" select="."/>
								<h2>
									<xsl:choose>
										<xsl:when test=".='EO'">
											<xsl:choose>
												<xsl:when test="$language='fi'">Toimijan Tullille välittämät sanomat</xsl:when>
												<xsl:when test="$language='sv'">Meddelanden som aktören skickar till Tullen</xsl:when>
												<xsl:when test="$language='en'">Messages from economic operator to Customs</xsl:when>
											</xsl:choose>
										</xsl:when>
										<xsl:otherwise>
											<xsl:choose>
												<xsl:when test="$language='fi'">Tullin vastaussanomat</xsl:when>
												<xsl:when test="$language='sv'">Tullens svarsmeddelanden</xsl:when>
												<xsl:when test="$language='en'">Customs' response messages</xsl:when>
											</xsl:choose>
										</xsl:otherwise>
									</xsl:choose>
								</h2>
								<xsl:for-each select="../../Message[Sender=$category]">
									<xsl:sort select="ID"/>
									<h4>
										<xsl:value-of select="Name[@lang=($language)]"/> (<xsl:value-of select="ID"/>)
									</h4>
									<xsl:for-each select="DescriptionLine[@lang=($language)]">
										<p>
											<xsl:value-of select="."/>
										</p>
									</xsl:for-each>
								</xsl:for-each>
							</xsl:for-each>
						</div>
					</article>
				</div>
			</div>
		</div>
		<div class="panel panel-primary">
			<div class="panel-heading" role="tab" id="heading-usecases">
				<h2 class="panel-title">
					<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true" aria-controls="usecases">
						<xsl:choose>
							<xsl:when test="$language='fi'">Käyttötapaukset</xsl:when>
							<xsl:when test="$language='sv'">Användningsfallen</xsl:when>
							<xsl:when test="$language='en'">Use cases</xsl:when>
						</xsl:choose>
					</a>
				</h2>
			</div>
			<div id="usecases" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading-usecases">
				<div class="panel-body">
					<article>
						<div class="content-area">
							<xsl:for-each select="MessageExchange/UseCases">
								<h3>
									<xsl:value-of select="Label[@lang=$language]"/>
								</h3>
								<ul>
									<xsl:for-each select="UseCase | Description">
										<xsl:choose>
											<xsl:when test="local-name()='Description'">
												<h4>
													<xsl:value-of select="Label[@lang=$language]"/>
												</h4>
											</xsl:when>
											<xsl:otherwise>
												<xsl:variable name="casenum">
													<xsl:number level="any" count="UseCase"/>
												</xsl:variable>
												<!--xsl:variable name="casenum"><xsl:number level="multiple" count="UseCases|UseCase"/></xsl:variable-->
												<li>
													<a>
														<xsl:attribute name="href">
															<xsl:value-of select="concat('#CASE', $casenum)"/>
														</xsl:attribute>
									Case <xsl:value-of select="$casenum"/>: <xsl:value-of select="Name[@lang=($language)]"/>
													</a>
												</li>
											</xsl:otherwise>
										</xsl:choose>
									</xsl:for-each>
								</ul>
							</xsl:for-each>
							<xsl:for-each select="MessageExchange/UseCases">
								<h3>
									<xsl:value-of select="Label[@lang=$language]"/>
								</h3>
								<xsl:for-each select="UseCase | Description">
									<xsl:choose>
										<xsl:when test="local-name()='Description'">
											<h4>
												<xsl:value-of select="Label[@lang=$language]"/>
											</h4>
											<xsl:for-each select="TextLine[@lang=($language)] | List | Table">
												<xsl:choose>
													<xsl:when test="local-name()='List'">
														<ul>
															<xsl:for-each select="ListItem[@lang=($language)]">
																<li>
																	<xsl:value-of select="."/>
																</li>
															</xsl:for-each>
														</ul>
													</xsl:when>
													<xsl:when test="local-name()='Table'">
														<table class="table table-striped table-responsive">
															<caption>
																<xsl:value-of select="Caption[@lang=($language)]"/>
															</caption>
															<thead>
																<tr>
																	<xsl:for-each select="Header/Cell">
																		<th>
																			<xsl:value-of select="TextLine[@lang=($language)]"/>
																		</th>
																	</xsl:for-each>
																</tr>
															</thead>
															<tbody>
																<xsl:for-each select="Line">
																	<tr>
																		<xsl:for-each select="Cell">
																			<td>
																				<xsl:for-each select="TextLine[@lang=($language)] | TextLine[not(@*)]">
																					<p>
																						<xsl:value-of select="."/>
																					</p>
																				</xsl:for-each>
																			</td>
																		</xsl:for-each>
																	</tr>
																</xsl:for-each>
															</tbody>
														</table>
													</xsl:when>
													<xsl:otherwise>
														<p>
															<xsl:value-of select="."/>
														</p>
													</xsl:otherwise>
												</xsl:choose>
											</xsl:for-each>
										</xsl:when>
										<xsl:otherwise>
											<xsl:variable name="casenum">
												<xsl:number level="any" count="UseCase"/>
											</xsl:variable>
											<h4>
												<xsl:attribute name="id">
													<xsl:value-of select="concat('CASE', $casenum)"/>
												</xsl:attribute>
								Case <xsl:value-of select="$casenum"/>: <xsl:value-of select="Name[@lang=($language)]"/>
											</h4>
											<table class="table table-striped table-responsive">
												<xsl:choose>
													<xsl:when test="$language='fi'">
														<thead>
															<tr>
																<th/>
																<th class="tabledata">Talouden toimija</th>
																<th/>
																<th class="tabledata">Tulli</th>
															</tr>
														</thead>
													</xsl:when>
													<xsl:when test="$language='sv'">
														<thead>
															<tr>
																<th/>
																<th class="tabledata">Ekonomisk aktör</th>
																<th/>
																<th class="tabledata">Tullen</th>
															</tr>
														</thead>
													</xsl:when>
													<xsl:when test="$language='en'">
														<thead>
															<tr>
																<th/>
																<th class="tabledata">Economic operator</th>
																<th/>
																<th class="tabledata">Customs</th>
															</tr>
														</thead>
													</xsl:when>
												</xsl:choose>
												<xsl:for-each select="Sequence/EO | Sequence/Customs | Sequence/Manual[@lang=$language]">
													<xsl:variable name="MSG" select="."/>
													<xsl:choose>
														<xsl:when test="local-name()='EO'">
															<tr>
																<td>
																	<xsl:value-of select="concat(position(),'.')"/>
																</td>
																<td>
																	<xsl:value-of select="/MessageExchange/Messages/Message/Name[@lang=($language) and ../ID= $MSG]"/>
																	<xsl:if test="@labelfi and $language='fi'">
																		<i> (<xsl:value-of select="@labelfi"/>)</i>
																	</xsl:if>
																	<xsl:if test="@labelsv and $language='sv'">
																		<i> (<xsl:value-of select="@labelsv"/>)</i>
																	</xsl:if>
																	<xsl:if test="@labelen and $language='en'">
																		<i> (<xsl:value-of select="@labelen"/>)</i>
																	</xsl:if>
																</td>
																<td>→</td>
																<td>&#8203;</td>
															</tr>
														</xsl:when>
														<xsl:when test="local-name()='Manual'">
															<tr>
																<td>
																	<xsl:value-of select="concat(position(),'.')"/>
																</td>
																<td colspan="100%">
																	<xsl:value-of select="."/>
																</td>
															</tr>
														</xsl:when>
														<xsl:otherwise>
															<tr>
																<td>
																	<xsl:value-of select="concat(position(),'.')"/>
																</td>
																<td>
																	<xsl:if test="@labelfi and $language='fi'">
																		<i> (<xsl:value-of select="@labelfi"/>)</i>
																	</xsl:if>
																	<xsl:if test="@labelsv and $language='sv'">
																		<i> (<xsl:value-of select="@labelsv"/>)</i>
																	</xsl:if>
																	<xsl:if test="@labelen and $language='en'">
																		<i> (<xsl:value-of select="@labelen"/>)</i>
																	</xsl:if>
																	&#8203;</td>
																<td>←</td>
																<td>
																	<xsl:value-of select="/MessageExchange/Messages/Message/Name[@lang=($language) and ../ID= $MSG]"/>
																</td>
															</tr>
														</xsl:otherwise>
													</xsl:choose>
												</xsl:for-each>
											</table>
											<ol>
												<xsl:for-each select="SequenceDescription/Item">
													<li>
														<xsl:for-each select="ItemLine[@lang=($language)]">
															<!-- Check if the ItemLine contains a hyperlink -->
															<xsl:choose>
																<xsl:when test="contains(., '[') and contains(., '](')">
																	<xsl:value-of select="substring-before(., '[')"/>
																	<!-- Extract hyperlink text and URL -->
																	<xsl:variable name="linkText" select="substring-before(substring-after(., '['), ']')"/>
																	<xsl:variable name="linkURL" select="substring-before(substring-after(., ']('), ')')"/>
																	<!-- Create the hyperlink -->
																	<a href="{$linkURL}">
																		<xsl:value-of select="$linkText"/>
																	</a>
																	<xsl:value-of select="substring-after(., concat($linkURL, ')'))"/>
																	<br/>
																</xsl:when>
																<xsl:otherwise>
																	<!-- If no hyperlink is present, simply output the text -->
																	<xsl:value-of select="."/>
																	<br/>
																</xsl:otherwise>
															</xsl:choose>
														</xsl:for-each>
													</li>
												</xsl:for-each>
											</ol>
										</xsl:otherwise>
									</xsl:choose>
								</xsl:for-each>
							</xsl:for-each>
						</div>
					</article>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>