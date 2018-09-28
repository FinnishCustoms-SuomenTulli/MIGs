<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html"/>
	<xsl:variable name="language">en</xsl:variable>
	<xsl:template match="Introduction">
		<table class="table table-striped table-responsive table-condensed">
			<thead>
				<tr>
					<xsl:choose>
						<xsl:when test="$language='fi'">
							<th>Versio ja päivämäärä</th>
							<th>Muutoksen syy</th>
						</xsl:when>
						<xsl:when test="$language='sv'">
							<th>Version och datum</th>
							<th>Orsak till ändring</th>
						</xsl:when>
						<xsl:when test="$language='en'">
							<th>Version and date</th>
							<th>Reason for amendment</th>
						</xsl:when>
					</xsl:choose>
				</tr>
			</thead>
			<xsl:for-each select="VersionHistory/Version">
				<tr>
					<td>
						<xsl:value-of select="Number"/>
						<br/>
						<xsl:choose>
							<xsl:when test="string-length(Date)=10">
								<xsl:choose>
									<xsl:when test="$language='en'">
										<xsl:value-of select="concat(substring(Date,9,2), '/', substring(Date,6,2), '/', substring(Date,1,4))"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:value-of select="concat(substring(Date,9,2), '.', substring(Date,6,2), '.', substring(Date,1,4))"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="Date"/>
							</xsl:otherwise>
						</xsl:choose>
					</td>
					<td>
						<xsl:value-of select="Remarks"/>
					</td>
				</tr>
			</xsl:for-each>
		</table>
	</xsl:template>
</xsl:stylesheet>
