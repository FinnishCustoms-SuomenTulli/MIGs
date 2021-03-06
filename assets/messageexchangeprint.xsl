<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:template match="/">
		<h2>
			<xsl:choose>
				<xsl:when test="$language='fi'">Yleistä</xsl:when>
				<xsl:when test="$language='sv'">Allmänt</xsl:when>
				<xsl:when test="$language='en'">General information</xsl:when>
			</xsl:choose>
		</h2>
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
		<h2>
			<xsl:choose>
				<xsl:when test="$language='fi'">Sanomat</xsl:when>
				<xsl:when test="$language='sv'">Meddelanden</xsl:when>
				<xsl:when test="$language='en'">Messages</xsl:when>
			</xsl:choose>
		</h2>
		<xsl:for-each select="MessageExchange/Messages/Message/Sender[not(preceding::Sender/. = .)]">
			<xsl:variable name="category" select="."/>
			<h3>
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
			</h3>
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
		<h2 class="panel-title">
			<a role="button" data-toggle="collapse" data-parent="#accordion" aria-expanded="true" aria-controls="usecases">
				<xsl:choose>
					<xsl:when test="$language='fi'">Käyttötapaukset</xsl:when>
					<xsl:when test="$language='sv'">Användningsfallen</xsl:when>
					<xsl:when test="$language='en'">Use cases</xsl:when>
				</xsl:choose>
			</a>
		</h2>
		<xsl:for-each select="MessageExchange/UseCases">
			<h3>
				<xsl:value-of select="Label[@lang=$language]"/>
			</h3>
			<xsl:for-each select="UseCase">
				<xsl:variable name="casenum">
					<xsl:number level="any" count="UseCase"/>
				</xsl:variable>
				<h4>Case <xsl:value-of select="$casenum"/>: <xsl:value-of select="Name[@lang=($language)]"/></h4>
				<table class="table table-striped">
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
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
