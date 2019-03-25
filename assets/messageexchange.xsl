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
												<xsl:when test="$language='sv'">Meddelanden från aktören till Tullen</xsl:when>
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
							<ul>
								<xsl:for-each select="MessageExchange/UseCases/UseCase">
									<li>
										<a>
											<xsl:attribute name="href"><xsl:value-of select="concat('#CASE', position())"/></xsl:attribute>
									CASE <xsl:number value="position()"/>: <xsl:value-of select="Name[@lang=($language)]"/>
										</a>
									</li>
								</xsl:for-each>
							</ul>
							<xsl:for-each select="MessageExchange/UseCases/UseCase">
								<h3>
									<xsl:attribute name="id"><xsl:value-of select="concat('CASE', position())"/></xsl:attribute>
								CASE <xsl:number value="position()"/>: <xsl:value-of select="Name[@lang=($language)]"/>
								</h3>
								<table class="table table-striped table-responsive">
									<xsl:choose>
										<xsl:when test="$language='fi'">
											<thead>
												<tr>
													<th class="tabledata">Talouden toimija</th>
													<th/>
													<th class="tabledata">Tulli</th>
												</tr>
											</thead>
										</xsl:when>
										<xsl:when test="$language='sv'">
											<thead>
												<tr>
													<th class="tabledata">Ekonomisk aktör</th>
													<th/>
													<th class="tabledata">Tullen</th>
												</tr>
											</thead>
										</xsl:when>
										<xsl:when test="$language='en'">
											<thead>
												<tr>
													<th class="tabledata">Economic operator</th>
													<th/>
													<th class="tabledata">Customs</th>
												</tr>
											</thead>
										</xsl:when>
									</xsl:choose>
									<xsl:for-each select="Sequence/EO | Sequence/Customs">
										<xsl:variable name="MSG" select="."/>
										<xsl:choose>
											<xsl:when test="local-name()='EO'">
												<tr>
													<td>
														<xsl:value-of select="/MessageExchange/Messages/Message/Name[@lang=($language) and ../ID= $MSG]"/>
													</td>
													<td>→</td>
													<td>&#8203;</td>
												</tr>
											</xsl:when>
											<xsl:otherwise>
												<tr>
													<td>&#8203;</td>
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
												<xsl:value-of select="."/>
												<br/>
											</xsl:for-each>
										</li>
									</xsl:for-each>
								</ol>
							</xsl:for-each>
						</div>
					</article>
				</div>
			</div>
		</div>
	</xsl:template>
</xsl:stylesheet>
