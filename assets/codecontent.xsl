<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:param name="language"/>
	<xsl:param name="messageType"/>
	<xsl:variable name="date" select="substring-before($messageType, '|')"/>
	<xsl:variable name="codelist" select="substring-after($messageType, '|')"/>
	<xsl:key name="filterDefinitions" match="CodeLists/Definitions/Filter" use="Name"/>
	<xsl:template match="/">
		<xsl:apply-templates select="CodeLists/CodeList[Identification = $codelist]"/>
	</xsl:template>
	<xsl:template match="CodeList">
		<p>
			<xsl:value-of select="Description[@lang=($language)]"/>
		</p>
		<table class="table table-striped table-hover table-responsive table-condensed">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>Koodi</th>
							<th>Nimi</th>
							<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
								<th>Selite</th>
							</xsl:if>
							<xsl:for-each select="CodeItem[not(Filter/Name=preceding-sibling::CodeItem/Filter/Name)]/Filter">
								<th data-toggle="tooltip" data-placement="top">
									<xsl:variable name="filterName" select="Name"/>
									<xsl:variable name="definitionFi" select="key('filterDefinitions', $filterName)/Definition[@lang='fi']"/>
									<xsl:attribute name="title">
										<xsl:value-of select="$definitionFi"/>
									</xsl:attribute>
									<xsl:choose>
										<xsl:when test="contains(Name, '_')">
											<xsl:value-of select="substring-after(Name, '_')"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="Name"/>
										</xsl:otherwise>
									</xsl:choose>
								</th>
							</xsl:for-each>
							<th>Voimassaolo</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>Kod</th>
							<th>Namn</th>
							<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
								<th>Förklaring</th>
							</xsl:if>
							<xsl:for-each select="CodeItem[not(Filter/Name=preceding-sibling::CodeItem/Filter/Name)]/Filter">
								<th data-toggle="tooltip" data-placement="top">
									<xsl:variable name="filterName" select="Name"/>
									<xsl:variable name="definitionSv" select="key('filterDefinitions', $filterName)/Definition[@lang='sv']"/>
									<xsl:attribute name="title">
										<xsl:value-of select="$definitionSv"/>
									</xsl:attribute>
									<xsl:choose>
										<xsl:when test="contains(Name, '_')">
											<xsl:value-of select="substring-after(Name, '_')"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="Name"/>
										</xsl:otherwise>
									</xsl:choose>
								</th>
							</xsl:for-each>
							<th>Giltighet</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>Code</th>
							<th>Name</th>
							<xsl:if test="count(CodeItem/Description[@lang=($language)][string(.)]) > 0">
								<th>Description</th>
							</xsl:if>
							<xsl:for-each select="CodeItem[not(Filter/Name=preceding-sibling::CodeItem/Filter/Name)]/Filter">
								<th data-toggle="tooltip" data-placement="top">
									<xsl:variable name="filterName" select="Name"/>
									<xsl:variable name="definitionEn" select="key('filterDefinitions', $filterName)/Definition[@lang='en']"/>
									<xsl:attribute name="title">
										<xsl:value-of select="$definitionEn"/>
									</xsl:attribute>
									<xsl:choose>
										<xsl:when test="contains(Name, '_')">
											<xsl:value-of select="substring-after(Name, '_')"/>
										</xsl:when>
										<xsl:otherwise>
											<xsl:value-of select="Name"/>
										</xsl:otherwise>
									</xsl:choose>
								</th>
							</xsl:for-each>
							<th>Validity</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="CodeItem">
				<xsl:variable name="start" select="concat(substring(StartDate,1,4), substring(StartDate,6,2), substring(StartDate,9,2))"/>
				<xsl:variable name="end" select="concat(substring(EndDate,1,4), substring(EndDate,6,2), substring(EndDate,9,2))"/>
				<!--xsl:if test="$end >= $date or $start lt $date"-->
				<xsl:if test="$end >= $date and $start &lt;= $date">
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
						<xsl:for-each select="Filter">
							<td>
								<xsl:if test="Value = 1">
									<span class="icon icon-tulli-checkmark"/>
								</xsl:if>
							</td>
						</xsl:for-each>
						<xsl:if test="../CodeItem/Filter and not(Filter)">
							<xsl:for-each select="../CodeItem[not(Filter=preceding-sibling::CodeItem/Filter)]/Filter">
								<td/>
							</xsl:for-each>
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
	</xsl:template>
</xsl:stylesheet>